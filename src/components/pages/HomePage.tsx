import { type Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import SkinCard from "@/components/SkinCard";

const AK_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/6f50d89b-e5fa-4d6f-9e38-998a9aa02d52.jpg";
const KNIFE_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/7f68def5-e12c-496a-b672-ede0fe35e272.jpg";
const AWP_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/1495c5d7-20d4-4b4c-b026-bbe853a5f120.jpg";

const stats = [
  { label: "Активных скинов", value: "284K+", icon: "Package" },
  { label: "Пользователей", value: "120K+", icon: "Users" },
  { label: "Сделок сегодня", value: "8,430", icon: "TrendingUp" },
  { label: "Платформ", value: "12", icon: "Globe" },
];

const topSkins = [
  { name: "Asiimov | Factory New", weapon: "AK-47", price: 89.99, oldPrice: 110.00, wear: "Factory New", rarity: "covert" as const, image: AK_IMG, trending: true, discount: 18 },
  { name: "Doppler Phase 2", weapon: "Karambit", price: 450.00, wear: "Factory New", rarity: "covert" as const, image: KNIFE_IMG, trending: true },
  { name: "Dragon Lore | FT", weapon: "AWP", price: 1890.00, wear: "Field-Tested", rarity: "covert" as const, image: AWP_IMG },
  { name: "Hyper Beast | FN", weapon: "M4A1-S", price: 34.50, oldPrice: 42.00, wear: "Factory New", rarity: "classified" as const, image: AK_IMG, discount: 18 },
  { name: "Fade | FN", weapon: "USP-S", price: 128.00, wear: "Factory New", rarity: "classified" as const, image: KNIFE_IMG },
  { name: "Printstream | MW", weapon: "Glock-18", price: 55.90, wear: "Minimal Wear", rarity: "classified" as const, image: AWP_IMG },
];

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 60% 50%, rgba(0,255,136,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,212,255,0.05) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-slide-up">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-rajdhani font-bold uppercase tracking-wider mb-6"
              style={{ border: "1px solid var(--neon-green)", color: "var(--neon-green)", background: "rgba(0,255,136,0.05)" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live — 8,430 сделок сегодня
            </div>

            <h1 className="text-5xl lg:text-7xl font-rajdhani font-bold leading-none mb-6 text-white">
              Лучший<br />
              <span className="gradient-text text-glow-green">маркетплейс</span><br />
              скинов CS2
            </h1>

            <p className="text-gray-400 text-lg font-golos mb-8 max-w-md leading-relaxed">
              Покупай и продавай скины по лучшим ценам. Сравнивай предложения с 12 платформ, получай бонусы и отслеживай аналитику.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                className="btn-neon px-6 py-3 rounded-xl text-base flex items-center gap-2"
                onClick={() => onNavigate("marketplace")}
              >
                <Icon name="ShoppingBag" size={18} />
                Перейти в маркетплейс
              </button>
              <button
                className="btn-outline-neon px-6 py-3 rounded-xl text-base flex items-center gap-2"
                onClick={() => onNavigate("compare")}
              >
                <Icon name="BarChart3" size={18} />
                Сравнить цены
              </button>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-2">
                {["🎮", "⚡", "🔥"].map((e, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm"
                    style={{ borderColor: "var(--dark-bg)", background: "var(--dark-card)" }}
                  >
                    {e}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 font-golos">
                <span className="text-white font-semibold">120,000+</span> игроков уже с нами
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ background: "radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)" }}
            />
            <img
              src={AWP_IMG}
              alt="AWP Dragon Lore"
              className="relative w-full max-w-lg object-contain float"
              style={{ filter: "drop-shadow(0 0 40px rgba(0,255,136,0.3))" }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y py-8" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)" }}
                >
                  <Icon name={s.icon} size={20} style={{ color: "var(--neon-green)" }} />
                </div>
                <div>
                  <div className="text-2xl font-rajdhani font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500 font-golos">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top skins */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-rajdhani font-bold text-white">
              🔥 Топ скины
            </h2>
            <p className="text-gray-500 text-sm font-golos mt-1">Самые популярные предложения прямо сейчас</p>
          </div>
          <button
            className="btn-outline-neon px-4 py-2 rounded-lg text-sm"
            onClick={() => onNavigate("marketplace")}
          >
            Все скины →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topSkins.map((skin, i) => (
            <SkinCard key={i} {...skin} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-rajdhani font-bold text-white mb-3">Почему SkinVault?</h2>
            <p className="text-gray-500 font-golos">Всё что нужно для торговли скинами в одном месте</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "BarChart3", title: "Аналитика цен", desc: "Отслеживай динамику цен, объёмы торгов и тренды рынка в реальном времени.", color: "var(--neon-green)" },
              { icon: "GitCompare", title: "Сравнение платформ", desc: "Сравнивай цены на 12 торговых площадках и находи лучшие предложения.", color: "var(--neon-cyan)" },
              { icon: "Bell", title: "Уведомления", desc: "Получай мгновенные алерты при достижении нужной цены на любой скин.", color: "var(--neon-purple)" },
              { icon: "Star", title: "Рейтинг скинов", desc: "Объективный рейтинг на основе ликвидности, динамики цен и отзывов.", color: "var(--neon-orange)" },
              { icon: "Search", title: "Умный поиск", desc: "Фильтры по оружию, редкости, износу, паттерну и цене.", color: "var(--neon-green)" },
              { icon: "Gift", title: "Бонус коды", desc: "Эксклюзивные промокоды от партнёрских платформ с дополнительными бонусами.", color: "var(--neon-cyan)" },
            ].map((f, i) => (
              <div key={i} className="card-dark card-hover rounded-xl p-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <Icon name={f.icon} size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-rajdhani font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 font-golos leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,255,136,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-5xl font-rajdhani font-bold text-white mb-4">
            Начни торговать <span className="gradient-text">прямо сейчас</span>
          </h2>
          <p className="text-gray-400 font-golos mb-8 text-lg">
            Войди через Steam и получи доступ ко всем функциям бесплатно
          </p>
          <button
            className="btn-neon px-8 py-4 rounded-xl text-lg flex items-center gap-3 mx-auto glow-green"
            onClick={() => onNavigate("profile")}
          >
            <Icon name="LogIn" size={22} />
            Войти через Steam
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-rajdhani font-bold"
              style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-cyan))", color: "var(--dark-bg)" }}
            >
              SV
            </div>
            <span className="font-rajdhani font-bold gradient-text">SkinVault</span>
          </div>
          <p className="text-xs text-gray-600 font-golos">
            © 2024 SkinVault. Не является официальным партнёром Valve Corporation.
          </p>
          <div className="flex gap-4 text-xs text-gray-600 font-golos">
            <span className="hover:text-white cursor-pointer transition-colors">Условия</span>
            <span className="hover:text-white cursor-pointer transition-colors">Конфиденциальность</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
