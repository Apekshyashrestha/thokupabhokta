import { lazy, Suspense, useEffect, useState } from "react";
import "./index.css";
import "./styles/global.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/home.css";
import "./styles/products.css";
import "./styles/about.css";
import "./styles/contact.css";
import "./styles/reports.css";
import "./styles/responsive.css";

import TopHeader from "./components/TopHeader";
import MainHeader from "./components/MainHeader";
import TickerBar from "./components/TickerBar";
import Footer from "./components/Footer";
import FirebaseStatus from "./components/FirebaseStatus";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReportsPage from "./pages/ReportsPage";
import NoticePage from "./pages/NoticePage";
import EventsPage from "./pages/EventsPage";
import CareerPage from "./pages/CareerPage";

const AdminPage = lazy(() => import("./pages/AdminPage"));

const isAdminHash = () => window.location.hash.replace(/^#\/?/, "").split("?")[0] === "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [adminRoute, setAdminRoute] = useState(isAdminHash());

  useEffect(() => {
    const onHashChange = () => setAdminRoute(isAdminHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (adminRoute) {
    return (
      <Suspense fallback={<div className="adm-center"><p className="adm-hint">Loading admin panel...</p></div>}>
        <AdminPage />
      </Suspense>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case "products":
        return <ProductsPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "reports":
        return <ReportsPage />;
      case "notice":
        return <NoticePage />;
      case "events":
        return <EventsPage />;
      case "career":
        return <CareerPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopHeader setActiveTab={setActiveTab} />
      <MainHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <TickerBar />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      <div style={{ maxWidth: 1180, margin: "12px auto 0", padding: "0 20px", display: "flex", justifyContent: "flex-end" }}>
        <FirebaseStatus />
      </div>
      <Footer />
    </div>
  );
}