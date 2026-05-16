import { useState } from "react";
import Navbar from "@/components/Navbar";
import HomePage from "@/components/pages/HomePage";
import MarketplacePage from "@/components/pages/MarketplacePage";
import BonusCodesPage from "@/components/pages/BonusCodesPage";
import PriceComparePage from "@/components/pages/PriceComparePage";
import ProfilePage from "@/components/pages/ProfilePage";
import AboutPage from "@/components/pages/AboutPage";
import ContactsPage from "@/components/pages/ContactsPage";
import FAQPage from "@/components/pages/FAQPage";
import { useSteamAuth } from "@/hooks/useSteamAuth";

export type Page = "home" | "marketplace" | "bonus" | "compare" | "profile" | "about" | "contacts" | "faq";

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("home");
  const auth = useSteamAuth();

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage onNavigate={setActivePage} auth={auth} />;
      case "marketplace": return <MarketplacePage />;
      case "bonus": return <BonusCodesPage />;
      case "compare": return <PriceComparePage />;
      case "profile": return <ProfilePage auth={auth} />;
      case "about": return <AboutPage />;
      case "contacts": return <ContactsPage />;
      case "faq": return <FAQPage />;
      default: return <HomePage onNavigate={setActivePage} auth={auth} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <Navbar activePage={activePage} onNavigate={setActivePage} auth={auth} />
      <main>{renderPage()}</main>
    </div>
  );
};

export default Index;