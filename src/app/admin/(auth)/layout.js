export const metadata = {
  title: "Admin Login | JobCareer",
  description: "Sign in to the JobCareer admin panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAuthLayout({ children }) {
  return <>{children}</>;
}