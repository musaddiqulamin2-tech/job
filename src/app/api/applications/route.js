import connectDB from "../../lib/mongodb";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

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
  },
  {
    timestamps: true,
  }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export async function POST(request) {
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
    const application = await Application.create({
      jobTitle: data.jobTitle,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      coverMessage: data.coverMessage,
      resumeUrl: resumeUrl,
      photoUrl: photoUrl,
    });

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