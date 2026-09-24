import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import AdminShell from "./components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}