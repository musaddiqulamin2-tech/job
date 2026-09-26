"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Toast } from "../components/AdminUI";

const LOG_LIMIT = 500;
const ACTIVITY_LIMIT = 120;
const ERROR_LIMIT = 60;

const LEVELS = ["INFO", "SUCCESS", "WARN", "ERROR", "DEBUG"];

const TONE_CLASS = {
  userRegistered: "lm-tone-green",
  jobCreated: "lm-tone-blue",
  appCreated: "lm-tone-purple",
  postPublished: "lm-tone-teal",
  postCreated: "lm-tone-slate",
  postUpdated: "lm-tone-slate",
  postDeleted: "lm-tone-red",
  jobUpdated: "lm-tone-slate",
  jobDeleted: "lm-tone-red",
  appUpdated: "lm-tone-blue",
  userDeleted: "lm-tone-red",
  admin: "lm-tone-orange",
  system: "lm-tone-slate",
};

const LEVEL_CLASS = {
  INFO: "lm-log-info",
  SUCCESS: "lm-log-success",
  WARN: "lm-log-warn",
  ERROR: "lm-log-error",
  DEBUG: "lm-log-debug",
};

function num(n) {
  return Number(n || 0).toLocaleString("en-IN");
}

function timeStr(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour12: false });
}

function stillParts(level) {
  return {
    label: level,
    cls: LEVEL_CLASS[level] || "lm-log-info",
  };
}

function StatCard({ href, label, value, delta, grad }) {
  const inner = (
    <>
      <div className="admin-stat-top">
        <span className="admin-stat-label">{label}</span>
        {delta != null && <span className="admin-stat-badge">↑ {num(delta)} today</span>}
      </div>
      <p className="admin-stat-value">{num(value)}</p>
      <span className="admin-stat-label">{href ? "Open section →" : "Live"}</span>
    </>
  );
  return href ? (
    <Link className={`admin-stat-card ${grad}`} href={href}>
      {inner}
    </Link>
  ) : (
    <div className={`admin-stat-card ${grad}`}>{inner}</div>
  );
}

function HealthTile({ label, status, note }) {
  const checking = typeof status === "string" && status.includes("Checking");
  const ok = status === "Connected" || status === "Operational" || status === "Running";
  const warn = status === "Reconnecting" || status === "Degraded";
  const cls = checking || status === "Unknown" ? "lm-h-unknown" : ok ? "lm-h-ok" : warn ? "lm-h-warn" : "lm-h-bad";
  return (
    <div className="lm-health-tile">
      <span className={`lm-health-dot ${cls}`} />
      <div className="lm-health-meta">
        <strong>{label}</strong>
        <span>{status}</span>
        {note && <em>{note}</em>}
      </div>
    </div>
  );
}

function MiniCard({ href, label, value, sub }) {
  const inner = (
    <>
      <span className="lm-mini-label">{label}</span>
      <strong className="lm-mini-value">{num(value)}</strong>
      {sub && <span className="lm-mini-sub">{sub}</span>}
    </>
  );
  return href ? (
    <Link className="lm-mini-card" href={href}>
      {inner}
    </Link>
  ) : (
    <div className="lm-mini-card">{inner}</div>
  );
}

export default function LiveMonitor() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activity, setActivity] = useState([]);
  const [adminEvents, setAdminEvents] = useState([]);
  const [errors, setErrors] = useState([]);
  const [apiEvents, setApiEvents] = useState([]);
  const [conn, setConn] = useState("connecting");
  const [lastReceived, setLastReceived] = useState(null);
  const [paused, setPaused] = useState(false);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollAway, setScrollAway] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [toast, setToast] = useState(null);
  const [reconnectDelay, setReconnectDelay] = useState(1000);
  const [loading, setLoading] = useState(true);

  const esRef = useRef(null);
  const logsRef = useRef([]);
  const activityRef = useRef([]);
  const adminRef = useRef([]);
  const errorsRef = useRef([]);
  const apiRef = useRef([]);
  const bufferRef = useRef([]);
  const pausedRef = useRef(false);
  const autoScrollRef = useRef(true);
  const atTopRef = useRef(true);
  const scrollBoxRef = useRef(null);
  const toastTimerRef = useRef(null);
  const closedRef = useRef(false);
  const retryRef = useRef(0);

  const showToast = useCallback((type, message, play) => {
    setToast({ type, message });
    if (play && soundOn) playBeep(type);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, [soundOn]);

  function playBeep(kind) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "error" ? "square" : "sine";
      osc.frequency.value = kind === "error" ? 220 : 880;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => ctx.close(), 500);
    } catch {
      // no audio — ignore
    }
  }

  const pushLog = useCallback((rec) => {
    const arr = [rec, ...logsRef.current];
    if (arr.length > LOG_LIMIT) arr.length = LOG_LIMIT;
    logsRef.current = arr;
    setLogs(arr);
  }, []);

  const pushActivity = useCallback((rec) => {
    const arr = [rec, ...activityRef.current];
    if (arr.length > ACTIVITY_LIMIT) arr.length = ACTIVITY_LIMIT;
    activityRef.current = arr;
    setActivity(arr);
    if (rec.tone === "admin") {
      const ad = [rec, ...adminRef.current];
      if (ad.length > 40) ad.length = 40;
      adminRef.current = ad;
      setAdminEvents(ad);
    }
  }, []);

  const pushError = useCallback((rec) => {
    const arr = [rec, ...errorsRef.current];
    if (arr.length > ERROR_LIMIT) arr.length = ERROR_LIMIT;
    errorsRef.current = arr;
    setErrors(arr);
  }, []);

  const handleStreamItem = useCallback((rec, kind) => {
    if (pausedRef.current) {
      bufferRef.current.push({ kind, rec });
      if (bufferRef.current.length > 200) bufferRef.current.shift();
      setBufferedCount(bufferRef.current.length);
      return;
    }
    if (kind === "log") pushLog(rec);
    else pushActivity(rec);
  }, [pushLog, pushActivity]);

  const upsertApiEvent = useCallback((rec) => {
    const arr = apiRef.current.filter((e) => !(e.method === rec.method && e.path === rec.path));
    arr.unshift(rec);
    if (arr.length > 40) arr.length = 40;
    apiRef.current = arr;
    setApiEvents(arr);
  }, []);

  const flushBuffer = useCallback(() => {
    const buffered = bufferRef.current;
    bufferRef.current = [];
    setBufferedCount(0);
    let lg = logsRef.current;
    let ac = activityRef.current;
    for (const { kind, rec } of buffered) {
      if (kind === "log") lg = [rec, ...lg];
      else ac = [rec, ...ac];
    }
    if (lg.length > LOG_LIMIT) lg.length = LOG_LIMIT;
    if (ac.length > ACTIVITY_LIMIT) ac.length = ACTIVITY_LIMIT;
    lg = buffered.length ? [...lg] : lg;
    ac = buffered.length ? [...ac] : ac;
    logsRef.current = lg;
    activityRef.current = ac;
    if (buffered.length) {
      setLogs(lg);
      setActivity(ac);
    }
  }, []);

  const fetchWrap = async (url) => {
    const res = await fetch(url, { credentials: "same-origin" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || res.status);
    return json;
  };

  const refreshBaseline = useCallback(async (which = ["stats", "health", "logs", "activity", "errors"]) => {
    try {
      const jobs = [];
      if (which.includes("stats")) jobs.push(fetchWrap("/api/admin/live/stats").then((j) => j.stats && setStats(j.stats)));
      if (which.includes("health")) jobs.push(fetchWrap("/api/admin/live/health").then((j) => j.health && setHealth(j.health)));
      if (which.includes("logs")) jobs.push(fetchWrap("/api/admin/live/logs?limit=500").then((j) => { logsRef.current = j.logs || []; setLogs(logsRef.current); }));
      if (which.includes("activity")) jobs.push(fetchWrap("/api/admin/live/activity?limit=120").then((j) => { activityRef.current = j.activity || []; setActivity(activityRef.current); }));
      if (which.includes("errors")) {
        jobs.push(fetchWrap("/api/admin/live/errors?limit=50").then((j) => { errorsRef.current = j.errors || []; setErrors(errorsRef.current); }));
      }
      await Promise.all(jobs);
    } finally {
      setLoading(false);
    }
  }, []);

  const openStream = useCallback(async () => {
    if (closedRef.current) return;
    try {
      const es = new EventSource("/api/admin/live/stream");
      esRef.current = es;

      es.addEventListener("open", () => {
        retryRef.current = 0;
        setReconnectDelay(1000);
        setConn("live");
      });

      es.addEventListener("hello", (ev) => {
        setConn("live");
        setLastReceived(new Date().toISOString());
      });

      es.addEventListener("stats:update", (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.stats) setStats(p.stats);
        } catch {
          // ignore malformed
        }
      });

      es.addEventListener("health", (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.health) setHealth(p.health);
        } catch {
          // ignore
        }
      });

      es.addEventListener("ping", () => {
        setLastReceived(new Date().toISOString());
      });

      es.addEventListener("log:new", (ev) => {
        try {
          handleStreamItem(JSON.parse(ev.data), "log");
        } catch {
          // ignore
        }
      });

      es.addEventListener("activity:new", (ev) => {
        try {
          handleStreamItem(JSON.parse(ev.data), "activity");
        } catch {
          // ignore
        }
      });

      es.addEventListener("error:new", (ev) => {
        try {
          pushError(JSON.parse(ev.data));
        } catch {
          // ignore
        }
      });

      es.addEventListener("api:call", (ev) => {
        try {
          upsertApiEvent(JSON.parse(ev.data));
        } catch {
          // ignore
        }
      });

      es.addEventListener("notify", (ev) => {
        try {
          const p = JSON.parse(ev.data);
          if (p.message) showToast("info", p.message, true);
        } catch {
          // ignore
        }
      });

      es.addEventListener("error", () => {
        // EventSource failed — manage manual reconnect with backoff and baseline refresh.
        if (closedRef.current) return;
        try {
          es.close();
        } catch {
          // ignore
        }
        esRef.current = null;
        setConn("reconnecting");
        retryRef.current += 1;
        const ms = Math.min(15000, 1000 * 2 ** (retryRef.current - 1));
        setReconnectDelay(ms);
        setTimeout(async () => {
          if (closedRef.current) return;
          await refreshBaseline(["logs", "activity", "errors", "stats", "health"]);
          if (closedRef.current) return;
          setConn("reconnecting");
          openStream();
        }, ms);
      });
    } catch {
      setConn("offline");
    }
  }, [refreshBaseline, handleStreamItem, pushError, upsertApiEvent, showToast]);

  useEffect(() => {
    closedRef.current = false;
    refreshBaseline(["stats", "health", "logs", "activity", "errors"]);
    openStream();

    return () => {
      closedRef.current = true;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      try {
        esRef.current?.close();
      } catch {
        // ignore
      }
      esRef.current = null;
    };
  }, [refreshBaseline, openStream]);

  useEffect(() => {
    pausedRef.current = paused;
    autoScrollRef.current = autoScroll && !scrollAway;
  }, [paused, autoScroll, scrollAway]);

  // Auto scroll newest logs into view when enabled
  useEffect(() => {
    if (autoScrollRef.current && atTopRef.current && scrollBoxRef.current) {
      scrollBoxRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [logs, filter, search]);

  const handleScroll = () => {
    const el = scrollBoxRef.current;
    if (!el) return;
    const atTop = el.scrollTop < 40;
    atTopRef.current = atTop;
    if (!atTop && autoScroll) setScrollAway(true);
    if (atTop && scrollAway) setScrollAway(false);
  };

  const goNewest = () => {
    atTopRef.current = true;
    setScrollAway(false);
    scrollBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleLogs = useMemo(() => {
    let arr = logs;
    if (filter !== "ALL") arr = arr.filter((l) => l.level === filter);
    const q = search.trim().toLowerCase();
    if (q) arr = arr.filter((l) => (l.message || "").toLowerCase().includes(q) || (l.source || "").toLowerCase().includes(q));
    return arr;
  }, [logs, filter, search]);

  const partial = stats || {};
  const db = health?.database;

  return (
    <div className="lm-wrap">
      {loading && (
        <div className="admin-loading-block">
          <span className="admin-spinner" /> Loading Live Monitor…
        </div>
      )}

      {/* Header */}
      <div className="lm-header">
        <div>
          <h2 className="lm-title">Live Monitor</h2>
          <p className="lm-sub">Real-time JobCareer system activity and application monitoring.</p>
        </div>
        <div className="lm-header-right">
          <div className={`lm-status-pill ${conn === "live" ? "lm-s-on" : conn === "reconnecting" ? "lm-s-warn" : "lm-s-off"}`}>
            {conn === "live" ? "🟢 System Online" : conn === "reconnecting" ? "🟠 Reconnecting…" : "🔴 Offline"}
          </div>
          <button
            type="button"
            className={`lm-sound-btn ${soundOn ? "on" : ""}`}
            onClick={() => setSoundOn((s) => !s)}
            title={soundOn ? "Notification sound ON" : "Notification sound OFF"}
          >
            {soundOn ? "🔔 Sound ON" : "🔕 Sound OFF"}
          </button>
        </div>
      </div>

      <div className="lm-meta-row">
        <span>Last updated: <strong>{db?.lastCheck || stats?.ts ? timeStr(db?.lastCheck || stats?.ts) : "Live"}</strong></span>
        <span>Connection: <strong>{conn === "live" ? "Connected" : conn === "reconnecting" ? "Reconnecting" : "Disconnected"}</strong></span>
        {lastReceived && <span>Last received: <strong>{timeStr(lastReceived)}</strong></span>}
      </div>

      {/* Overview cards */}
      <div className="admin-stats lm-stats">
        <StatCard href="/admin/users" label="TOTAL USERS" value={partial.users} delta={partial.newUsersToday} grad="grad-blue" />
        <StatCard href="/admin/users" label="ACTIVE USERS (15m)" value={partial.activeUsers} grad="grad-green" />
        <StatCard href="/admin/live-monitor" label="ONLINE VISITORS (5m)" value={partial.onlineVisitors} grad="grad-orange" />
        <StatCard href="/admin/jobs" label="JOBS POSTED" value={partial.jobs} delta={partial.jobsToday} grad="grad-purple" />
        <StatCard href="/admin/applications" label="APPLICATIONS" value={partial.applications} delta={partial.applicationsToday} grad="grad-blue" />
        <StatCard href="/admin/applications" label="APPLICATIONS TODAY" value={partial.applicationsToday} grad="grad-green" />
        <StatCard href="/admin/jobs" label="JOBS TODAY" value={partial.jobsToday} grad="grad-orange" />
        <StatCard href="/admin/users" label="NEW USERS TODAY" value={partial.newUsersToday} grad="grad-green" />
      </div>

      {/* System health */}
      <section className="admin-card lm-section">
        <div className="admin-card-header">
          <h2>System Health</h2>
          {health && <span className="admin-chip"><span className="chip-dot" /> Auto-checked</span>}
        </div>
        <div className="lm-health-grid">
          <HealthTile label="API Status" status={health?.api?.status || "Checking…"} note={health?.api?.recentErrors ? `${health.api.recentErrors} recent failure(s)` : "Live API probe"} />
          <HealthTile label="Database" status={db?.status || "Checking…"} note={db?.database ? `${db.database} · ${db.responseMs ?? "—"} ms` : "MongoDB"} />
          <HealthTile label="Real-Time Connection" status={conn === "live" ? "Connected" : conn === "reconnecting" ? "Reconnecting" : "Offline"} note={health?.realTime?.transport ? `SSE ${health.realTime.transport}` : "SSE"} />
          <HealthTile label="Application Server" status={health?.server?.status || "Running"} note="Next.js" />
          <HealthTile label="Email Service" status={health?.email?.status || "Unknown"} note={health?.email?.note || ""} />
          <HealthTile label="Cloudinary" status={health?.cloudinary?.status || "Unknown"} note={health?.cloudinary?.note || ""} />
        </div>
      </section>

      <div className="admin-dash-row lm-two">
        {/* Live activity */}
        <section className="admin-card lm-section">
          <div className="admin-card-header">
            <h2>Live Activity</h2>
            <span className="lm-count">{activity.length}</span>
          </div>
          <div className="lm-activity">
            {activity.length === 0 ? (
              <p className="lm-empty">No recent activity.</p>
            ) : (
              activity.slice(0, 40).map((a, i) => (
                <div className="lm-activity-item" key={a.id ? `${a.timestamp}-${a.id}` : `${a.timestamp}-${i}`}>
                  <span className={`lm-tone ${TONE_CLASS[a.tone] || "lm-tone-slate"}`} />
                  <div>
                    <div className="lm-activity-line">
                      {a.link ? <Link href={a.link}>{a.message}</Link> : <span>{a.message}</span>}
                      {a.sub && <em>{a.sub}</em>}
                    </div>
                    <span className="lm-activity-time">{timeStr(a.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Admin activity */}
        <section className="admin-card lm-section">
          <div className="admin-card-header">
            <h2>Admin Activity</h2>
            <span className="lm-count">{adminEvents.length}</span>
          </div>
          <div className="lm-activity">
            {adminEvents.length === 0 ? (
              <p className="lm-empty">No admin activity yet.</p>
            ) : (
              adminEvents.slice(0, 30).map((a, i) => (
                <div className="lm-activity-item" key={`${a.timestamp}-${i}`}>
                  <span className="lm-tone lm-tone-orange" />
                  <div>
                    <div className="lm-activity-line">
                      <span>{a.message}</span>
                      <em>{a.sub}</em>
                    </div>
                    <span className="lm-activity-time">{timeStr(a.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Live log stream */}
      <section className="admin-card lm-section">
        <div className="admin-card-header lm-log-toolbar">
          <h2>Live Log Stream</h2>
          <div className="lm-log-actions">
            {paused && (
              <button type="button" className="admin-btn admin-btn-warn admin-btn-sm" onClick={() => { setPaused(false); flushBuffer(); }}>
                Resume Stream {bufferedCount > 0 && `(${bufferedCount})`}
              </button>
            )}
            {!paused && (
              <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setPaused(true)}>
                Pause Stream
              </button>
            )}
            <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setClearConfirm(true)}>
              Clear View
            </button>
          </div>
        </div>

        <div className="lm-log-controls">
          <div className="lm-filter-row">
            {["ALL", ...LEVELS].map((lv) => (
              <button
                key={lv}
                type="button"
                className={`lm-filter-chip ${filter === lv ? "active" : ""}`}
                onClick={() => setFilter(lv)}
              >
                {lv}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="lm-search"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="lm-autoscroll">
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} />
            Auto Scroll <strong>{autoScroll ? "ON" : "OFF"}</strong>
          </label>
        </div>

        {paused && (
          <div className="lm-paused-banner">
            {bufferedCount > 0 ? `Paused — ${bufferedCount} new event(s) buffered` : "Paused — no new events"}
          </div>
        )}

        <div className="lm-log-wrap" ref={scrollBoxRef} onScroll={handleScroll}>
          {visibleLogs.length === 0 ? (
            <p className="lm-empty">No live logs available.</p>
          ) : (
            visibleLogs.map((l, i) => {
              const s = stillParts(l.level);
              return (
                <div className="lm-log-line" key={`${l.timestamp}-${i}`}>
                  <span className="lm-log-time">[{timeStr(l.timestamp)}]</span>
                  <span className={`lm-log-level ${s.cls}`}>{l.level.padEnd(7, " ")}</span>
                  <span className="lm-log-source">{l.source}</span>
                  <span className="lm-log-msg">{l.message}</span>
                </div>
              );
            })
          )}
        </div>

        {scrollAway && (
          <button type="button" className="lm-gonew" onClick={goNewest}>
            New logs available ↓
          </button>
        )}
      </section>

      <div className="admin-dash-row lm-two">
        {/* Application monitor */}
        <section className="admin-card lm-section">
          <div className="admin-card-header">
            <h2>Application Monitor</h2>
            <span className="lm-count lm-live">LIVE</span>
          </div>
          <div className="lm-mini-grid">
            <MiniCard href="/admin/applications" label="Today" value={partial.applicationsToday} sub="Created today" />
            <MiniCard href="/admin/applications" label="This Week" value={partial.applicationsWeek} />
            <MiniCard href="/admin/applications" label="This Month" value={partial.applicationsMonth} />
            <MiniCard href="/admin/applications?status=Pending" label="Pending" value={partial.pendingApplications} />
            <MiniCard href="/admin/applications?status=Reviewing" label="Reviewed" value={partial.reviewingApplications} />
            <MiniCard href="/admin/applications?status=Rejected" label="Rejected" value={partial.rejectedApplications} />
            <MiniCard href="/admin/applications?status=Shortlisted" label="Shortlisted" value={partial.shortlistedApplications} />
            <MiniCard href="/admin/applications?status=Selected" label="Accepted" value={partial.selectedApplications} />
          </div>
        </section>

        {/* Job monitor */}
        <section className="admin-card lm-section">
          <div className="admin-card-header">
            <h2>Job Monitor</h2>
            <span className="lm-count lm-live">LIVE</span>
          </div>
          <div className="lm-mini-grid">
            <MiniCard href="/admin/jobs" label="Total Jobs" value={partial.jobs} />
            <MiniCard href="/admin/jobs?status=Active" label="Active Jobs" value={partial.activeJobs} />
            <MiniCard href="/admin/jobs?status=Inactive" label="Draft / Inactive" value={partial.draftJobs} />
            <MiniCard href="/admin/jobs?status=Expired" label="Expired Jobs" value={partial.expiredJobs} />
            <MiniCard href="/admin/jobs" label="Posted Today" value={partial.jobsToday} />
            <MiniCard href="/admin/jobs" label="Updated Today" value={partial.jobsUpdatedToday} />
          </div>
        </section>
      </div>

      {/* User monitor */}
      <section className="admin-card lm-section">
        <div className="admin-card-header">
          <h2>User Monitor</h2>
          <span className="lm-count lm-live">LIVE</span>
        </div>
        <div className="lm-mini-grid lm-mini-grid-5">
          <MiniCard href="/admin/users" label="Total Users" value={partial.users} />
          <MiniCard href="/admin/users" label="New Today" value={partial.newUsersToday} />
          <MiniCard href="/admin/live-monitor" label="Active (15m)" value={partial.activeUsers} />
          <MiniCard href="/admin/users" label="This Week" value={partial.newUsersWeek} />
          <MiniCard href="/admin/users" label="This Month" value={partial.newUsersMonth} />
        </div>
        <p className="lm-privacy-note">🔒 Privacy: monitor shows aggregate counts only. No passwords, tokens, or personal data are displayed.</p>
      </section>

      <div className="admin-dash-row lm-two">
        {/* API health */}
        <section className="admin-card lm-section">
          <div className="admin-card-header">
            <h2>API Health</h2>
            <span className="lm-count">{apiEvents.length}</span>
          </div>
          <div className="admin-table-wrap lm-table-wrap">
            <table className="admin-table lm-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Response</th>
                  <th>Last Called</th>
                </tr>
              </thead>
              <tbody>
                {apiEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="lm-empty-cell">
                      No API calls recorded yet — they appear as traffic happens.
                    </td>
                  </tr>
                ) : (
                  apiEvents.map((e, i) => (
                    <tr key={`${e.method}-${e.path}-${i}`}>
                      <td><code>{e.method}</code></td>
                      <td><code>{e.path}</code></td>
                      <td>
                        <span className={`admin-badge ${e.status < 400 ? "admin-badge-green" : e.status < 500 ? "admin-badge-orange" : "admin-badge-red"}`}>
                          {e.status}
                        </span>
                      </td>
                      <td>{e.ms}ms</td>
                      <td>{timeStr(new Date(e.lastCalled).toISOString())}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Error monitor */}
        <section className="admin-card lm-section">
          <div className="admin-card-header">
            <h2>Error Monitor</h2>
            <span className="lm-count">{errors.length}</span>
          </div>
          <div className="admin-table-wrap lm-table-wrap">
            <table className="admin-table lm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Level</th>
                  <th>Source</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {errors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="lm-empty-cell">✓ No recent errors.</td>
                  </tr>
                ) : (
                  errors.slice(0, 25).map((e, i) => (
                    <tr key={`${e.timestamp}-${i}`}>
                      <td>{timeStr(e.timestamp)}</td>
                      <td><span className="lm-log-level lm-log-error">{e.level}</span></td>
                      <td>{e.source}</td>
                      <td className="lm-err-msg">{e.message}</td>
                      <td>{e.status || "—"}</td>
                      <td>{e.requestId ? <span className="lm-reqid">{e.requestId}</span> : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Clear confirmation */}
      {clearConfirm && (
        <div className="admin-modal-overlay" onClick={() => setClearConfirm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Clear visible logs?</h3>
            <p>This only clears the current browser display. Server logs are never deleted.</p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setClearConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => {
                  logsRef.current = [];
                  setLogs([]);
                  setClearConfirm(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}