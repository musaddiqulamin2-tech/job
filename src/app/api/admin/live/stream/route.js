import { requireAdmin } from "../../../../lib/adminGuard";
import {
  computeStats,
  computeHealth,
  setSubscriberCount,
  subscriberCount,
  emitEvent,
} from "../../../../lib/liveServer";
import { getEmitter } from "../../../../lib/liveEmitter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STREAM_EVENTS = [
  "log:new",
  "activity:new",
  "error:new",
  "api:call",
  "stats:update",
  "health",
  "notify",
  "job:created",
  "job:updated",
  "job:deleted",
  "application:created",
  "application:updated",
  "user:created",
  "user:deleted",
  "admin:activity",
  "content:published",
  "content:updated",
  "content:deleted",
  "system:error",
];

function sse(encoder, type, payload) {
  const data = JSON.stringify(payload ?? {});
  return encoder.encode(`event: ${type}\ndata: ${data}\n\n`);
}

export async function GET(request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const encoder = new TextEncoder();
  const emitter = getEmitter();

  setSubscriberCount(subscriberCount() + 1);

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (type, payload) => {
        if (closed) return;
        try {
          controller.enqueue(sse(encoder, type, payload));
        } catch {
          // individual send failures are ignored
        }
      };

      const cleanup = () => {
        if (closed) return;
        closed = true;
        setSubscriberCount(Math.max(0, subscriberCount() - 1));
        for (const t of STREAM_EVENTS) emitter.removeListener(t, listeners.get(t));
        try {
          controller.close();
        } catch {
          // ignore
        }
      };

      // Subscribe to every event type and forward it over SSE.
      const listeners = new Map();
      for (const t of STREAM_EVENTS) {
        const listener = (payload) => send(t, payload);
        listeners.set(t, listener);
        emitter.on(t, listener);
      }

      send("hello", {
        ts: new Date().toISOString(),
        admin: { name: session?.name || "Admin", email: session?.email || "" },
      });

      // Initial real snapshot (stats + health), then forward live deltas.
      Promise.allSettled([computeStats(), computeHealth()]).then(([s, h]) => {
        send("stats:update", { stats: s.status === "fulfilled" ? s.value : null });
        send("health", { health: h.status === "fulfilled" ? h.value : null });
      });

      const heartbeat = setInterval(async () => {
        if (closed) return;
        send("ping", { ts: new Date().toISOString() });
        try {
          const stats = await computeStats();
          send("stats:update", { stats });
          const health = await computeHealth();
          send("health", { health });
        } catch {
          // keep stream alive even if a probe fails
        }
      }, 15 * 1000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        cleanup();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}