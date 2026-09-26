import connectDB from "../../lib/mongodb";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Worker from "../../lib/models/Worker";
import {
  log as liveLog,
  activity as liveActivity,
  emitEvent,
  trackApiCall,
  trackVisitor,
  bumpStats,
} from "../../lib/liveServer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const start = Date.now();
  trackVisitor(request);
  try {
    await connectDB();

    const data = await request.json();

    const existing = await Worker.findOne({ mobile: data.mobile });
    if (existing) {
      return Response.json(
        {
          success: false,
          message: "This mobile number is already registered!",
        },
        { status: 409 }
      );
    }

    let documentUrl = "";

    if (data.document) {
      const upload = await cloudinary.uploader.upload(data.document, {
        folder: "jobcareer/kyc",
        resource_type: "auto",
      });

      documentUrl = upload.secure_url;
    }

    const worker = await Worker.create({
      name: data.name,
      mobile: data.mobile,
      state: data.state,
      district: data.district,
      workType: data.workType,
      kycType: data.kycType,
      kycNumber: data.kycNumber,
      documentUrl,
    });

    emitEvent("user:created", { _id: String(worker._id), name: worker.name });
    liveLog({
      level: "SUCCESS",
      source: "UsersAPI",
      message: `New user registered: ${worker.name}`,
    });
    liveActivity({
      tone: "userRegistered",
      message: "New user registered",
      sub: worker.name,
      id: String(worker._id),
      link: "/admin/users",
    });
    emitEvent("notify", { tone: "user", message: "New user registered" });
    bumpStats();

    trackApiCall({ method: "POST", path: "/api/register", status: 201, ms: Date.now() - start });
    return Response.json(
      {
        success: true,
        message: "Registration submitted successfully!",
        worker,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    liveLog({ level: "ERROR", source: "UsersAPI", message: `Registration failed: ${error.message}` });
    trackApiCall({ method: "POST", path: "/api/register", status: 500, ms: Date.now() - start });
    return Response.json(
      {
        success: false,
        message: "Registration failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}