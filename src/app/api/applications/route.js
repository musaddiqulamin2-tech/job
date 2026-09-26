import connectDB from "../../lib/mongodb";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { getSession, unauthorized } from "../../lib/auth";
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

const applicationSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    coverMessage: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    photoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewing", "Shortlisted", "Rejected", "Selected"],
      default: "Pending",
    },
    statusNote: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export async function POST(request) {
  const start = Date.now();
  trackVisitor(request);
  try {
    await connectDB();

    const data = await request.json();

    let resumeUrl = "";
    let photoUrl = "";

    // Resume Cloudinary par upload
    if (data.resume) {
      const resumeUpload = await cloudinary.uploader.upload(
        data.resume,
        {
          folder: "jobcareer/resumes",
          resource_type: "auto",
        }
      );

      resumeUrl = resumeUpload.secure_url;
    }

    // Photo Cloudinary par upload
    if (data.photo) {
      const photoUpload = await cloudinary.uploader.upload(
        data.photo,
        {
          folder: "jobcareer/photos",
          resource_type: "image",
        }
      );

      photoUrl = photoUpload.secure_url;
    }

    // MongoDB me application save
    const application =
      await Application.create({
      jobTitle: data.jobTitle,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      coverMessage: data.coverMessage,
      resumeUrl: resumeUrl,
      photoUrl: photoUrl,
      status: "Pending",
    });

    emitEvent("application:created", {
      _id: String(application._id),
      jobTitle: application.jobTitle,
      fullName: application.fullName,
    });
    liveLog({
      level: "SUCCESS",
      source: "ApplicationsAPI",
      message: `New application received${application.jobTitle ? ` for ${application.jobTitle}` : ""}`,
    });
    liveActivity({
      tone: "appCreated",
      message: "Application submitted",
      sub: application.jobTitle || application.fullName || "New application",
      id: String(application._id),
      link: `/admin/applications/${application._id}`,
    });
    emitEvent("notify", { tone: "application", message: "New application received" });
    bumpStats();

    trackApiCall({ method: "POST", path: "/api/applications", status: 201, ms: Date.now() - start });
    return Response.json(
      {
        success: true,
        message: "Application submitted successfully!",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application Error:", error);
    liveLog({ level: "ERROR", source: "ApplicationsAPI", message: `Application submission failed: ${error.message}` });
    trackApiCall({ method: "POST", path: "/api/applications", status: 500, ms: Date.now() - start });
    return Response.json(
      {
        success: false,
        message: "Application submission failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    await connectDB();

    const applications = await Application.find()
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);

    return Response.json(
      {
        success: false,
        message: "Applications fetch nahi hui",
        error: error.message,
      },
      { status: 500 }
    );
  }
}