export const metadata = {
  title: "Admin Panel | JobCareer",
  description: "JobCareer admin management panel",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }) {
  return <>{children}</>;
}