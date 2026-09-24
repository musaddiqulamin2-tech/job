"use client";

import { use, useEffect, useState } from "react";
import JobForm from "../../components/JobForm";
import { Spinner, ErrorState, Toast } from "../../components/AdminUI";

export default function AdminJobEdit({ params }) {
  const { id } = use(params);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/jobs/${id}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to load job.");
      }
      setJob(json.job);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="admin-page">
        <Spinner label="Loading job..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="admin-page">
        <ErrorState message={error || "Job not found."} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="admin-page-header">
        <div>
          <h1>Edit Job</h1>
          <p>{job.title}</p>
        </div>
      </div>

      <JobForm initial={job} jobId={id} />
    </div>
  );
}