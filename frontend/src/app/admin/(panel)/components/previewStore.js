const PREFIX = "jobcareer:preview:";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;
let lastPrune = 0;

export function previewKey(id) {
  return `${PREFIX}${id}`;
}

export function createPreviewId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function pruneStaleEntries() {
  const now = Date.now();
  if (now - lastPrune < 60 * 1000) return;
  lastPrune = now;
  for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || "{}");
      if (!parsed.at || now - parsed.at > MAX_AGE_MS) window.localStorage.removeItem(key);
    } catch {
      window.localStorage.removeItem(key);
    }
  }
}

export function savePreviewPayload(id, payload) {
  if (typeof window === "undefined" || !id) return false;
  try {
    pruneStaleEntries();
    window.localStorage.setItem(previewKey(id), JSON.stringify({ at: Date.now(), payload }));
    return true;
  } catch {
    return false;
  }
}

export function readPreviewPayload(id) {
  if (typeof window === "undefined" || !id) return null;
  try {
    const raw = window.localStorage.getItem(previewKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.payload ? parsed.payload : null;
  } catch {
    return null;
  }
}

export function clearPreviewPayload(id) {
  if (typeof window === "undefined" || !id) return;
  try {
    window.localStorage.removeItem(previewKey(id));
  } catch {
    /* ignore */
  }
}
