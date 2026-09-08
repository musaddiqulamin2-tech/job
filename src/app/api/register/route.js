import connectDB from "../../lib/mongodb";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Worker from "../../lib/models/Worker";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
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