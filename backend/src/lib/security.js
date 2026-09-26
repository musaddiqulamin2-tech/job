const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 6;

const attempts = new Map();

export function loginRateCheck(key) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now > rec.resetAt) {
    return { ok: true, remaining: LOGIN_MAX_ATTEMPTS, retryAfterMs: 0 };
  }
  return {
    ok: rec.count < LOGIN_MAX_ATTEMPTS,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - rec.count),
    retryAfterMs: rec.resetAt - now,
  };
}

export function recordLoginFailure(key) {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now > rec.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    rec.count += 1;
  }
  if (attempts.size > 5000) {
    const cutoff = now - LOGIN_WINDOW_MS;
    for (const [k, v] of attempts) {
      if (v.resetAt < cutoff) attempts.delete(k);
    }
  }
}

export function clearLoginFailures(key) {
  attempts.delete(key);
}

// Bearer-token auth replaces CSRF for cross-origin requests — kept as
// no-ops so ported handlers keep working unchanged.
export function generateCsrfToken() {
  return null;
}

export async function setCsrfCookie() {
  return null;
}

export async function csrfTokenFromCookies() {
  return "";
}

export async function verifyCsrf() {
  return true;
}