import { AsyncLocalStorage } from "node:async_hooks";

export const asyncStore = new AsyncLocalStorage();

export function getAuthRequest() {
  return asyncStore.getStore() || null;
}

export function makeRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host") || "localhost";
  const url = `${proto}://${host}${req.originalUrl || req.url}`;
  const ac = new AbortController();
  if (req.on) {
    req.on("close", () => ac.abort());
  }
  return {
    url,
    headers: {
      get: (name) => {
        if (!name) return null;
        const v = req.get(name);
        return v === undefined ? null : v;
      },
    },
    json: async () => (req.body && typeof req.body === "object" ? req.body : {}),
    signal: ac.signal,
  };
}

export async function ship(res, response) {
  if (response === undefined || response === null) {
    if (!res.writableEnded) res.status(200).json({ success: true });
    return;
  }
  if (typeof Response !== "undefined" && response instanceof Response) {
    const type = response.headers.get("content-type") || "";
    if (type.includes("text/event-stream")) {
      return shipStream(res, response);
    }
    const text = await response.text();
    res.status(response.status || 200);
    for (const [k, v] of response.headers) {
      const lk = k.toLowerCase();
      if (
        lk === "content-length" ||
        lk === "transfer-encoding" ||
        lk === "connection"
      ) {
        continue;
      }
      res.setHeader(k, v);
    }
    if (!res.writableEnded) res.send(text);
    return;
  }
  if (!res.writableEnded) res.status(200).json(response);
}

export async function shipStream(res, response) {
  res.status(response.status || 200);
  for (const [k, v] of response.headers) {
    const lk = k.toLowerCase();
    if (lk === "content-length" || lk === "transfer-encoding") continue;
    res.setHeader(k, v);
  }
  res.flushHeaders();
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  res.on("close", () => {
    reader.cancel().catch(() => {});
  });
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(decoder.decode(value, { stream: true }));
    }
  } catch {
    // connection aborted
  }
  if (!res.writableEnded) res.end();
}

export function expressify(handler) {
  return (req, res) => {
    const request = makeRequest(req);
    const params = { ...(req.params || {}) };
    asyncStore.run(request, async () => {
      try {
        const response = await handler(request, { params });
        await ship(res, response);
        if (!res.writableEnded) res.end();
      } catch (err) {
        console.error("[route]", err);
        try {
          await ship(
            res,
            Response.json(
              { success: false, message: "Internal server error." },
              { status: 500 }
            )
          );
        } catch {
          // response already sent
        }
        if (!res.writableEnded) res.end();
      }
    });
  };
}