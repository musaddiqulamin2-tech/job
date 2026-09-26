import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
