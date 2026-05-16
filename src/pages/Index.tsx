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
import { useAlerts } from "@/hooks/useAlerts";
import PriceAlertModal from "@/components/PriceAlertModal";

export type Page = "home" | "marketplace" | "bonus" | "compare" | "profile" | "about" | "contacts" | "faq";

interface AlertTarget {
  name: string;
  weapon: string;
  price: number;
}

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("home");
  const auth = useSteamAuth();
  const alertsHook = useAlerts(!!auth.user);
  const [alertTarget, setAlertTarget] = useState<AlertTarget | null>(null);

  const openAlert = (name: string, weapon: string, price: number) => {
    if (!auth.user) { auth.login(); return; }
    setAlertTarget({ name, weapon, price });
  };

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage onNavigate={setActivePage} auth={auth} onAlert={openAlert} />;
      case "marketplace": return <MarketplacePage onAlert={openAlert} />;
      case "bonus": return <BonusCodesPage />;
      case "compare": return <PriceComparePage />;
      case "profile": return <ProfilePage auth={auth} alertsHook={alertsHook} />;
      case "about": return <AboutPage />;
      case "contacts": return <ContactsPage />;
      case "faq": return <FAQPage />;
      default: return <HomePage onNavigate={setActivePage} auth={auth} onAlert={openAlert} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <Navbar activePage={activePage} onNavigate={setActivePage} auth={auth} alertCount={alertsHook.triggeredAlerts.length} />
      <main>{renderPage()}</main>

      {alertTarget && (
        <PriceAlertModal
          skinName={alertTarget.name}
          skinWeapon={alertTarget.weapon}
          currentPrice={alertTarget.price}
          onClose={() => setAlertTarget(null)}
          onSave={async (targetPrice) => {
            const result = await alertsHook.createAlert({
              skin_name: alertTarget.name,
              skin_weapon: alertTarget.weapon,
              target_price: targetPrice,
              current_price: alertTarget.price,
            });
            return result;
          }}
        />
      )}
    </div>
  );
};

export default Index;
