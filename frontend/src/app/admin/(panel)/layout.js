import AdminShell from "./components/AdminShell";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}