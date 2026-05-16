import { useState } from "react";
import Icon from "@/components/ui/icon";

const AK_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/6f50d89b-e5fa-4d6f-9e38-998a9aa02d52.jpg";

const compareSkins = [
  {
    name: "AK-47 | Asiimov (Factory New)",
    image: AK_IMG,
    platforms: [
      { name: "Steam", price: 110.50, fee: "15%", link: "#" },
      { name: "DMarket", price: 89.99, fee: "5%", link: "#" },
      { name: "Skinport", price: 92.40, fee: "12%", link: "#" },
      { name: "CS.Money", price: 94.00, fee: "2%", link: "#" },
      { name: "BitSkins", price: 91.20, fee: "5%", link: "#" },
      { name: "Waxpeer", price: 88.50, fee: "3%", link: "#" },
    ],
  },
];

const history = [
  { date: "Нояб 2024", price: 95.00 },
  { date: "Окт 2024", price: 88.00 },
  { date: "Сент 2024", price: 102.00 },
  { date: "Авг 2024", price: 79.00 },
  { date: "Июль 2024", price: 85.50 },
  { date: "Июнь 2024", price: 91.00 },
];

const PriceComparePage = () => {
  const [search, setSearch] = useState("");
  const skin = compareSkins[0];
  const prices = skin.platforms.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-rajdhani font-bold text-white mb-2">📊 Сравнение цен</h1>
        <p className="text-gray-500 font-golos">Найди лучшую цену на любой скин среди 12 платформ</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Введи название скина для сравнения..."
          className="w-full pl-12 pr-4 py-4 rounded-xl font-golos text-white placeholder-gray-600 outline-none text-lg"
          style={{ background: "var(--dark-card)", border: "1px solid var(--dark-border)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
        />
      </div>

      {/* Skin compare card */}
      <div className="card-dark rounded-2xl overflow-hidden mb-8">
        <div className="p-6 border-b flex items-center gap-5" style={{ borderColor: "var(--dark-border)" }}>
          <img src={skin.image} alt={skin.name} className="w-24 h-16 object-contain" />
          <div>
            <h2 className="text-xl font-rajdhani font-bold text-white">{skin.name}</h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm font-golos" style={{ color: "var(--neon-green)" }}>
                Лучшая цена: ${minPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600 font-golos">Разница: ${(maxPrice - minPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {skin.platforms
            .sort((a, b) => a.price - b.price)
            .map((p, i) => {
              const isMin = p.price === minPrice;
              const widthPct = ((p.price - minPrice) / (maxPrice - minPrice + 1)) * 80 + 20;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-golos text-gray-400 flex-shrink-0">{p.name}</div>
                  <div className="flex-1 relative h-9 flex items-center">
                    <div
                      className="h-full rounded-lg flex items-center px-3 transition-all"
                      style={{
                        width: `${widthPct}%`,
                        background: isMin ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isMin ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.05)"}`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="text-base font-rajdhani font-bold"
                      style={{ color: isMin ? "var(--neon-green)" : "white" }}
                    >
                      ${p.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-600 font-golos w-8">+{p.fee}</span>
                    {isMin && (
                      <span
                        className="text-xs font-rajdhani font-bold px-2 py-0.5 rounded"
                        style={{ background: "var(--neon-green)", color: "var(--dark-bg)" }}
                      >
                        ЛУЧШЕЕ
                      </span>
                    )}
                    <a
                      href={p.link}
                      className="text-xs btn-outline-neon px-2 py-1 rounded-lg"
                    >
                      Купить →
                    </a>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Price history */}
      <div className="card-dark rounded-2xl p-6">
        <h3 className="text-xl font-rajdhani font-bold text-white mb-6">История цен (Steam)</h3>
        <div className="flex items-end gap-3 h-40">
          {history.map((h, i) => {
            const allPrices = history.map((x) => x.price);
            const min = Math.min(...allPrices);
            const max = Math.max(...allPrices);
            const pct = ((h.price - min) / (max - min + 1)) * 75 + 25;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-rajdhani text-white">${h.price}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${pct}%`,
                    background: "linear-gradient(to top, var(--neon-green), var(--neon-cyan))",
                    opacity: 0.7 + i * 0.05,
                  }}
                />
                <span className="text-xs text-gray-600 font-golos text-center">{h.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceComparePage;
