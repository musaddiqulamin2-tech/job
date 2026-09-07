import AdminShell from "./components/AdminShell";

export const metadata = {
  title: "Admin Panel | JobCareer",
  description: "Admin management panel",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}