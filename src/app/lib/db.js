export const DB_TIMEOUT_MS = 2500;

export function withTimeout(promise, ms = DB_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("db-timeout")), ms)
    ),
  ]);
}

export function dbUnavailable() {
  return Response.json(
    {
      success: false,
      code: "DB_UNAVAILABLE",
      message:
        "Database is temporarily unavailable. Please try again in a moment.",
    },
    { status: 503 }
  );
}

export function isDbError(err) {
  if (!err) return false;
  if (err.message === "db-timeout") return true;
  return err.name === "MongooseServerSelectionError" || err.name === "MongoServerSelectionError";
}