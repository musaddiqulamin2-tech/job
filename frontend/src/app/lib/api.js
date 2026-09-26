export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TOKEN_KEY = "jc_admin_token";

export function getToken() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
}

export function clearToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
}

export async function apiFetch(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
    cache: opts.cache ?? "no-store",
  });
  if (res.status === 401 && typeof window !== "undefined") {
    const on401 = window.__jcOnUnauthorized;
    if (typeof on401 === "function") on401();
  }
  return res;
}

export function setOnUnauthorized(handler) {
  if (typeof window !== "undefined") {
    window.__jcOnUnauthorized = handler;
  }
}

function getStreamHeaders() {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function streamEvents(path, { onEvent, onError, onDone, signal } = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: getStreamHeaders(),
      cache: "no-store",
      signal,
    });
    if (!res.ok || !res.body) {
      if (typeof onError === "function") onError(new Error(`HTTP ${res.status}`));
      if (typeof onDone === "function") onDone();
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        let eventName = "message";
        let dataLine;
        for (const line of raw.split("\n")) {
          if (line.startsWith("event:")) eventName = line.slice(6).trim();
          else if (line.startsWith("data:")) dataLine = line;
        }
        if (!dataLine) continue;
        try {
          const data = JSON.parse(dataLine.slice(5).trim());
          if (typeof onEvent === "function") onEvent(data, eventName);
        } catch {
          // skip malformed frame
        }
      }
    }
  } catch (err) {
    if (err.name !== "AbortError" && typeof onError === "function") onError(err);
  } finally {
    if (typeof onDone === "function") onDone();
  }
}

export async function apiJson(path, opts = {}) {
  const res = await apiFetch(path, opts);
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  return { ok: res.ok, status: res.status, data };
}