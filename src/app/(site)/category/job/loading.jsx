export default function JobsLoading() {
  return (
    <div className="ja-cat-page site grid-container container hfeed" id="page">
      <div className="site-content" id="content">
        <div className="content-area" id="primary">
          <main className="site-main" id="main">
            <div className="gb-element-bf2aea27" style={{ rowGap: "1rem", paddingBottom: "1.5rem" }}>
              <div className="section-bar gb-element-906b3e4d" style={{ backgroundColor: "#dc2626", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.875rem", padding: "7px 10px", borderRadius: "0.25rem", marginBottom: 0, borderBottom: "none" }}>
                <h1 className="gb-text section-title" style={{ margin: 0, fontSize: "14px", fontWeight: 700, lineHeight: 1, color: "#ffffff" }}>Jobs</h1>
              </div>
              <div className="jb-skeleton" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="jb-sk-card" key={i}>
                    <div className="jb-sk jb-sk-head" />
                    <div className="jb-sk jb-sk-line" />
                    <div className="jb-sk jb-sk-line short" />
                    <div className="jb-sk jb-sk-btn" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}