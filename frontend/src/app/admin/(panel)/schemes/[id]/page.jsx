"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SchemeEditor from "../../components/SchemeEditor";
import { Spinner, ErrorState } from "../../components/AdminUI";
import { apiJson } from "../../components/api";

export default function EditSchemePage() {
  const params = useParams();
  const id = params.id;
  const [scheme, setScheme] = useState(undefined);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { res, data } = await apiJson(`/api/admin/schemes/${id}`);
      if (!res.ok) throw new Error(data?.message || "Could not load this scheme.");
      setScheme(data.scheme);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="admin-page">
        <ErrorState
          message={error}
          onRetry={() => {
            setError("");
            setScheme(undefined);
            load();
          }}
        />
      </div>
    );
  }

  if (scheme === undefined) {
    return (
      <div className="admin-page">
        <Spinner label="Loading scheme..." />
      </div>
    );
  }

  return <SchemeEditor schemeId={id} initial={scheme} />;
}
