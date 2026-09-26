import mongoose from "mongoose";

import Admin from "../src/lib/models/Admin.js";
import Application from "../src/lib/models/Application.js";
import Category from "../src/lib/models/Category.js";
import Post from "../src/lib/models/Post.js";
import Media from "../src/lib/models/Media.js";
import Job from "../src/lib/models/Job.js";
import JobSubmission from "../src/lib/models/JobSubmission.js";
import Result from "../src/lib/models/Result.js";
import SiteSetting from "../src/lib/models/SiteSetting.js";
import SystemLog from "../src/lib/models/SystemLog.js";
import Worker from "../src/lib/models/Worker.js";
import Admission from "../src/lib/models/Admission.js";
import AdmitCard from "../src/lib/models/AdmitCard.js";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI missing.");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
    console.log("Connected to MongoDB.");

    const models = [
      Admin,
      Application,
      Category,
      Post,
      Media,
      Job,
      JobSubmission,
      Result,
      SiteSetting,
      SystemLog,
      Worker,
      Admission,
      AdmitCard,
    ];

    for (const model of models) {
      const name = model.modelName;
      await model.init();
      const info = await model.listIndexes();
      const idx = info.map((i) => i.name).join(", ");
      console.log(`OK ${name}: ${idx}`);
    }

    console.log("sync-indexes completed successfully.");
  } catch (error) {
    console.error("sync-indexes error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

main();