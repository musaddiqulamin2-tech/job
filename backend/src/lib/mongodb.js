import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your backend env (.env)");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!cached.logged) {
      cached.logged = true;
      let host = "(unparsable)";
      try {
        host = new URL(MONGODB_URI).host;
      } catch {
        /* keep fallback label */
      }
      console.log(`MONGODB connecting to host: ${host}`);
    }
    cached.promise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .then((conn) => {
        cached.conn = conn;
        console.log("MONGODB connected");
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        console.error(
          "MONGODB connect failed:",
          err.name,
          "|",
          err.message,
          "| code:",
          err.code ?? "-"
        );
        throw err;
      });
  }

  return cached.promise;
}