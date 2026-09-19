import connectDB from "../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import JobSubmission from "../../lib/models/JobSubmission";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JOB_CATEGORIES = [
  "Government Job",
  "Banking Job",
  "Railway Job",
  "PSU Job",
  "Private Job",
  "Teaching Job",
  "Other",
];

const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Work From Home",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const URL_RE = /^https?:\/\/.+\..+/i;

const MAX_NOTIFICATION_MB = 10;
const MAX_LOGO_MB = 2;

function fileBytes(dataUrl) {
  const comma = dataUrl.indexOf(",");
  const b64 = comma === -1 ? dataUrl : dataUrl.slice(comma + 1);
  const len = b64.length;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((len * 3) / 4 - padding);
}

function mimeType(dataUrl) {
  const m = /^data:([^;,]+)[;,]/i.exec(dataUrl);
  return m ? m[1].toLowerCase() : "";
}

function isValidISODate(value) {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        message:
          "Unable to submit your job right now. Please check your information and try again.",
      },
      { status: 400 }
    );
  }

  // Honeypot spam trap: bots fill the hidden field, humans never do.
  if (data.confirmWebsite && data.confirmWebsite.trim()) {
    return Response.json(
      {
        success: true,
        message: "Job Submitted Successfully!",
        submission: { status: "PENDING_REVIEW" },
      },
      { status: 200 }
    );
  }

  const fields = {
    companyName: String(data.companyName || "").trim(),
    officialEmail: String(data.officialEmail || "").trim(),
    contactPhone: String(data.contactPhone || "").trim(),
    companyWebsite: String(data.companyWebsite || "").trim(),
    address: String(data.address || "").trim(),
    jobTitle: String(data.jobTitle || "").trim(),
    vacancies: Number(data.vacancies),
    category: String(data.category || "").trim(),
    location: String(data.location || "").trim(),
    employmentType: String(data.employmentType || "").trim(),
    salary: String(data.salary || "").trim(),
    startDate: String(data.startDate || "").trim(),
    lastDate: String(data.lastDate || "").trim(),
    qualification: String(data.qualification || "").trim(),
    experience: String(data.experience || "").trim(),
    ageLimit: String(data.ageLimit || "").trim(),
    applicationProcess: String(data.applicationProcess || "").trim(),
    applicationUrl: String(data.applicationUrl || "").trim(),
    description: String(data.description || "").trim(),
    responsibilities: String(data.responsibilities || "").trim(),
  };

  const errors = [];

  if (!fields.companyName) errors.push("Company Name is required.");
  if (!EMAIL_RE.test(fields.officialEmail))
    errors.push("Enter a valid official email address.");
  if (!PHONE_RE.test(fields.contactPhone))
    errors.push("Enter a valid 10-digit contact number.");
  if (fields.companyWebsite && !URL_RE.test(fields.companyWebsite))
    errors.push("Website must be a valid URL (https://...).");
  if (!fields.address) errors.push("Company address is required.");
  if (!fields.jobTitle) errors.push("Job Title is required.");
  if (!Number.isInteger(fields.vacancies) || fields.vacancies < 1 || fields.vacancies > 1000)
    errors.push("Number of vacancies must be between 1 and 1000.");
  if (!JOB_CATEGORIES.includes(fields.category))
    errors.push("Please select a valid job category.");
  if (!fields.location) errors.push("Job location is required.");
  if (!EMPLOYMENT_TYPES.includes(fields.employmentType))
    errors.push("Please select a valid employment type.");
  if (!fields.qualification) errors.push("Required qualification is required.");
  if (!fields.experience) errors.push("Experience required is required.");
  if (!fields.description) errors.push("Job description is required.");
  if (fields.applicationUrl && !URL_RE.test(fields.applicationUrl))
    errors.push("Application link must be a valid URL.");

  if (fields.startDate && !isValidISODate(fields.startDate))
    errors.push("Start date is not valid.");
  if (fields.lastDate && !isValidISODate(fields.lastDate))
    errors.push("Last date is not valid.");
  if (
    fields.startDate &&
    fields.lastDate &&
    new Date(fields.lastDate) < new Date(fields.startDate)
  ) {
    errors.push("Application last date cannot be before the start date.");
  }

  const notificationFile = String(data.notificationFile || "");
  if (notificationFile) {
    if (mimeType(notificationFile) !== "application/pdf") {
      errors.push("Notification / advertisement must be a PDF file.");
    } else if (fileBytes(notificationFile) > MAX_NOTIFICATION_MB * 1024 * 1024) {
      errors.push("Notification PDF must be under 10 MB.");
    }
  }

  const companyLogo = String(data.companyLogo || "");
  const allowedLogos = ["image/jpeg", "image/png", "image/webp"];
  if (companyLogo) {
    const mime = mimeType(companyLogo);
    if (!allowedLogos.includes(mime)) {
      errors.push("Company logo must be a JPG, JPEG, PNG, or WEBP image.");
    } else if (fileBytes(companyLogo) > MAX_LOGO_MB * 1024 * 1024) {
      errors.push("Company logo must be under 2 MB.");
    }
  }

  if (errors.length > 0) {
    return Response.json(
      { success: false, message: errors[0] },
      { status: 400 }
    );
  }

  let notificationFileUrl = "";
  let companyLogoUrl = "";

  try {
    await connectDB();

    if (notificationFile) {
      const upload = await cloudinary.uploader.upload(notificationFile, {
        folder: "jobcareer/submissions",
        resource_type: "auto",
      });
      notificationFileUrl = upload.secure_url;
    }

    if (companyLogo) {
      const upload = await cloudinary.uploader.upload(companyLogo, {
        folder: "jobcareer/company-logos",
        resource_type: "image",
      });
      companyLogoUrl = upload.secure_url;
    }

    const submission = await JobSubmission.create({
      ...fields,
      notificationFileUrl,
      companyLogoUrl,
      status: "PENDING_REVIEW",
    });

    return Response.json(
      {
        success: true,
        message: "Job Submitted Successfully!",
        submission: {
          _id: String(submission._id),
          companyName: submission.companyName,
          jobTitle: submission.jobTitle,
          status: submission.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submit Job Error:", error);

    return Response.json(
      {
        success: false,
        message:
          "Unable to submit your job right now. Please check your information and try again.",
      },
      { status: 500 }
    );
  }
}