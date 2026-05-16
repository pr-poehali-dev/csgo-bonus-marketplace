import { useState } from "react";
import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import { type useSteamAuth } from "@/hooks/useSteamAuth";

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  auth: ReturnType<typeof useSteamAuth>;
  alertCount?: number;
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

const Navbar = ({ activePage, onNavigate, auth, alertCount = 0 }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, login, logout, loading } = auth;

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
          <span className="text-xl font-rajdhani font-bold gradient-text hidden sm:block">
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
                activePage === item.id ? "" : "text-gray-400 hover:text-white"
              }`}
              style={
                activePage === item.id
                  ? { background: "rgba(0, 255, 136, 0.08)", color: "var(--neon-green)" }
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
          {/* Bell icon with badge */}
          {user && alertCount > 0 && (
            <button
              onClick={() => onNavigate("profile")}
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: "var(--neon-green)" }}
              title={`${alertCount} сработавших алертов`}
            >
              <Icon name="Bell" size={18} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-rajdhani font-bold flex items-center justify-center"
                style={{ background: "var(--neon-orange)", color: "white", fontSize: "10px" }}
              >
                {alertCount}
              </span>
            </button>
          )}
          {!loading && (
            user ? (
              <button
                onClick={() => onNavigate("profile")}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ border: "1px solid var(--dark-border)" }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full" />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,255,136,0.15)" }}
                  >
                    <Icon name="User" size={14} style={{ color: "var(--neon-green)" }} />
                  </div>
                )}
                <span className="text-sm font-golos text-white max-w-[100px] truncate">{user.username}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); logout(); }}
                  className="ml-1 text-gray-600 hover:text-white transition-colors"
                  title="Выйти"
                >
                  <Icon name="LogOut" size={13} />
                </button>
              </button>
            ) : (
              <button
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-rajdhani font-bold uppercase tracking-wider transition-all duration-200 btn-neon"
                onClick={login}
              >
                <Icon name="LogIn" size={14} />
                Войти через Steam
              </button>
            )
          )}

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
                activePage === item.id ? "" : "text-gray-400"
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
          {!loading && !user && (
            <button
              onClick={() => { login(); setMobileOpen(false); }}
              className="w-full btn-neon mt-2 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Icon name="LogIn" size={16} />
              Войти через Steam
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;