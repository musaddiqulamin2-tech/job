"use client";

import JobForm from "../../components/JobForm";

export default function AdminJobNew() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Add New Job</h1>
          <p>Create a new job listing for your board.</p>
        </div>
      </div>

      <JobForm />
    </div>
  );
}