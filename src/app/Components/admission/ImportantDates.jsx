export default function ImportantDates({ dates, highlightLast = true }) {
  if (!dates || dates.length === 0) return null;
  const last = dates[dates.length - 1];
  return (
    <div className="ad-wrap-scroll">
      <table className="ad-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {highlightLast && last ? (
        <p className="ad-dates-deadline">
          Application Last Date: <strong>{last.value}</strong> — no applications
          will be accepted after this date.
        </p>
      ) : null}
    </div>
  );
}