import Link from "next/link";

export default function ImportantLinks({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="ad-wrap-scroll">
      <table className="ad-table ad-links-table">
        <thead>
          <tr>
            <th>Important Links</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.label}>
              <td>{link.label}</td>
              <td>
                {link.url ? (
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ad-open-link"
                  >
                    {link.cta || "Click Here"}
                  </Link>
                ) : (
                  <span className="ad-open-link ad-open-link-soon" role="status">
                    Coming Soon
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}