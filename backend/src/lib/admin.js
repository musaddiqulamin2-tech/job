export const APP_STATUSES = ["Pending", "Reviewing", "Shortlisted", "Rejected", "Selected"];

export const JOB_STATUSES = ["Active", "Inactive", "Expired"];

export const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship", "Remote"];

export function jobStatus(job) {
  return job.status || (job.active === false ? "Inactive" : "Active");
}