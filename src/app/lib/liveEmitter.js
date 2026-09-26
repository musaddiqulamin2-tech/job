import { EventEmitter } from "events";

const LOG_RETAIN = 1000;
const ACTIVITY_RETAIN = 200;
const ERROR_RETAIN = 200;
const API_TRACK_MAX = 40;
const VISITOR_TTL_MS = 5 * 60 * 1000;

function createLive() {
  return {
    emitter: new EventEmitter(),
    logs: [],
    activity: [],
    errors: [],
    apiEvents: new Map(),
    visitors: new Map(),
    lastStats: null,
    lastHealth: null,
    subscriberCount: 0,
  };
}

const g = typeof globalThis !== "undefined" ? globalThis : {};
if (!g.__jcLive) g.__jcLive = createLive();
const live = g.__jcLive;

export function emitEvent(type, payload = {}) {
  try {
    live.emitter.emit(type, payload);
  } catch {
    // never break the request pipeline
  }
}

export function liveLog({ level = "INFO", source = "System", message = "", status, requestId, meta } = {}) {
  const rec = {
    timestamp: new Date().toISOString(),
    level,
    source: String(source || "System"),
    message: String(message || "").slice(0, 1000),
    status: status != null ? Number(status) : null,
    requestId: requestId || null,
    meta: meta || null,
  };

  live.logs.unshift(rec);
  if (live.logs.length > LOG_RETAIN) live.logs.length = LOG_RETAIN;

  if (level === "ERROR") {
    live.errors.unshift({
      timestamp: rec.timestamp,
      level: "ERROR",
      source: rec.source,
      message: rec.message,
      status: rec.status,
      requestId: rec.requestId,
    });
    if (live.errors.length > ERROR_RETAIN) live.errors.length = ERROR_RETAIN;
    emitEvent("error:new", rec);
  }

  // Persist only useful operational logs (WARN/ERROR) — bounded, TTL-retained in MongoDB.
  if (level === "ERROR" || level === "WARN") {
    import("./systemLog")
      .then((m) => m.persistSystemLog(rec))
      .catch(() => {});
  }

  emitEvent("log:new", rec);
  return rec;
}

export function liveActivity({ tone = "system", message = "", sub = "", id, link } = {}) {
  const rec = {
    timestamp: new Date().toISOString(),
    tone: String(tone || "system"),
    message: String(message || "").slice(0, 400),
    sub: String(sub || "").slice(0, 400),
    id: id ? String(id) : null,
    link: link ? String(link) : null,
  };

  live.activity.unshift(rec);
  if (live.activity.length > ACTIVITY_RETAIN) live.activity.length = ACTIVITY_RETAIN;

  emitEvent("activity:new", rec);
  return rec;
}

export function trackApiCall({ method = "GET", path = "/", status = 200, ms = 0 } = {}) {
  if (!path) return;
  const key = `${method} ${path}`;
  const prev = live.apiEvents.get(key);
  live.apiEvents.set(key, {
    method: String(method).toUpperCase(),
    path: path.split("?")[0],
    status: Number(status) || 200,
    ms: Math.max(0, Math.round(Number(ms) || 0)),
    lastCalled: Date.now(),
    calls: (prev?.calls || 0) + 1,
  });

  if (live.apiEvents.size > API_TRACK_MAX) {
    const oldestKey = live.apiEvents.keys().next().value;
    live.apiEvents.delete(oldestKey);
  }

  emitEvent("api:call", live.apiEvents.get(key));
}

export function trackVisitor(request) {
  try {
    const ip =
      request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request?.headers?.get("x-real-ip") ||
      "local";
    const now = Date.now();
    live.visitors.set(ip, now);
    if (live.visitors.size > 2000) {
      const cutoff = now - VISITOR_TTL_MS;
      for (const [k, v] of live.visitors) {
        if (v < cutoff) live.visitors.delete(k);
      }
    }
  } catch {
    // ignore
  }
}

export function visitorCount(windowMs) {
  const cutoff = Date.now() - windowMs;
  let n = 0;
  for (const [, t] of live.visitors) {
    if (t >= cutoff) n += 1;
  }
  return n;
}

export function getSnapshot() {
  return {
    logs: live.logs.slice(0, 500),
    activity: live.activity.slice(0, 200),
    errors: live.errors.slice(0, 200),
    apiEvents: Array.from(live.apiEvents.values()).sort((a, b) => b.lastCalled - a.lastCalled),
    stats: live.lastStats,
    health: live.lastHealth,
  };
}

export function setSubscriberCount(n) {
  live.subscriberCount = Math.max(0, n);
}

export function subscriberCount() {
  return live.subscriberCount;
}

export function cacheStats(stats) {
  if (stats) live.lastStats = stats;
}

export function cacheHealth(health) {
  if (health) live.lastHealth = health;
}

export function getEmitter() {
  return live.emitter;
}