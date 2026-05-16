import { useState } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "marketplace", label: "Маркетплейс", icon: "ShoppingBag" },
  { id: "bonus", label: "Бонус коды", icon: "Gift" },
  { id: "compare", label: "Сравнение цен", icon: "BarChart3" },
  { id: "profile", label: "Профиль", icon: "User" },
  { id: "about", label: "О нас", icon: "Info" },
  { id: "contacts", label: "Контакты", icon: "Mail" },
  { id: "faq", label: "FAQ", icon: "HelpCircle" },
];

const Navbar = ({ activePage, onNavigate }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: "rgba(8, 12, 18, 0.9)",
        borderColor: "var(--dark-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold pulse-neon"
            style={{
              background: "linear-gradient(135deg, var(--neon-green), var(--neon-cyan))",
              color: "var(--dark-bg)",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            SV
          </div>
          <span
            className="text-xl font-rajdhani font-bold gradient-text hidden sm:block"
          >
            SkinVault
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-golos font-medium transition-all duration-200 ${
                activePage === item.id
                  ? "neon-green"
                  : "text-gray-400 hover:text-white"
              }`}
              style={
                activePage === item.id
                  ? {
                      background: "rgba(0, 255, 136, 0.08)",
                      color: "var(--neon-green)",
                    }
                  : {}
              }
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-rajdhani font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, var(--neon-green), var(--neon-cyan))",
              color: "var(--dark-bg)",
            }}
            onClick={() => onNavigate("profile")}
          >
            <Icon name="Steam" size={14} fallback="LogIn" />
            Войти через Steam
          </button>

          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 space-y-1"
          style={{ borderColor: "var(--dark-border)", backgroundColor: "var(--dark-card)" }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-golos transition-all ${
                activePage === item.id ? "neon-green" : "text-gray-400"
              }`}
              style={
                activePage === item.id
                  ? { background: "rgba(0, 255, 136, 0.08)", color: "var(--neon-green)" }
                  : {}
              }
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
