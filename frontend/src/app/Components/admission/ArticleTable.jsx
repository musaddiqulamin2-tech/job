export default function ArticleTable({ title, headers, rows, caption }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="ad-wrap-scroll">
      {title ? <h3 className="ad-sub-heading">{title}</h3> : null}
      <table className="ad-table">
        {headers ? (
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, idx) => {
            const cells = Array.isArray(row) ? row : Object.values(row);
            return (
              <tr key={idx}>
                {cells.map((c, cIdx) => (
                  <td key={cIdx}>{c ?? "—"}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {caption ? <p className="ad-table-caption">{caption}</p> : null}
    </div>
  );
}