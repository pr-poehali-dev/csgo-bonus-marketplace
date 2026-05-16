import { useState } from "react";
import Icon from "@/components/ui/icon";
import SkinCard from "@/components/SkinCard";

const AK_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/6f50d89b-e5fa-4d6f-9e38-998a9aa02d52.jpg";
const KNIFE_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/7f68def5-e12c-496a-b672-ede0fe35e272.jpg";
const AWP_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/1495c5d7-20d4-4b4c-b026-bbe853a5f120.jpg";

const allSkins = [
  { name: "Asiimov | FN", weapon: "AK-47", price: 89.99, oldPrice: 110.00, wear: "Factory New", rarity: "covert" as const, image: AK_IMG, trending: true, discount: 18 },
  { name: "Doppler Phase 2", weapon: "Karambit", price: 450.00, wear: "Factory New", rarity: "covert" as const, image: KNIFE_IMG, trending: true },
  { name: "Dragon Lore | FT", weapon: "AWP", price: 1890.00, wear: "Field-Tested", rarity: "covert" as const, image: AWP_IMG },
  { name: "Hyper Beast | FN", weapon: "M4A1-S", price: 34.50, oldPrice: 42.00, wear: "Factory New", rarity: "classified" as const, image: AK_IMG, discount: 18 },
  { name: "Fade | FN", weapon: "USP-S", price: 128.00, wear: "Factory New", rarity: "classified" as const, image: KNIFE_IMG },
  { name: "Printstream | MW", weapon: "Glock-18", price: 55.90, wear: "Minimal Wear", rarity: "classified" as const, image: AWP_IMG },
  { name: "Redline | FT", weapon: "AK-47", price: 12.50, wear: "Field-Tested", rarity: "restricted" as const, image: AK_IMG },
  { name: "Neon Rider | MW", weapon: "AWP", price: 280.00, oldPrice: 310.00, wear: "Minimal Wear", rarity: "covert" as const, image: AWP_IMG, discount: 10 },
  { name: "Monkey Business | FN", weapon: "AK-47", price: 22.00, wear: "Factory New", rarity: "milspec" as const, image: AK_IMG },
  { name: "Tiger Tooth | FN", weapon: "M9 Bayonet", price: 380.00, wear: "Factory New", rarity: "covert" as const, image: KNIFE_IMG, trending: true },
  { name: "Vulcan | FN", weapon: "AK-47", price: 95.00, wear: "Factory New", rarity: "covert" as const, image: AK_IMG },
  { name: "Medusa | FT", weapon: "AWP", price: 430.00, wear: "Field-Tested", rarity: "covert" as const, image: AWP_IMG },
];

const weapons = ["Все", "AK-47", "AWP", "M4A1-S", "Glock-18", "Ножи", "USP-S"];
const wears = ["Все", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn"];
const rarities = ["Все", "Тайное", "Засекреченное", "Запрещённое", "Армейское"];
const sorts = ["Цена ↑", "Цена ↓", "Популярные", "Новые"];

const MarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [weapon, setWeapon] = useState("Все");
  const [sort, setSort] = useState("Популярные");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const filtered = allSkins.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.weapon.toLowerCase().includes(search.toLowerCase());
    const matchWeapon = weapon === "Все" || s.weapon === weapon;
    const matchFrom = !priceFrom || s.price >= parseFloat(priceFrom);
    const matchTo = !priceTo || s.price <= parseFloat(priceTo);
    return matchSearch && matchWeapon && matchFrom && matchTo;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-rajdhani font-bold text-white mb-2">Маркетплейс</h1>
        <p className="text-gray-500 font-golos">
          {filtered.length} предложений · Обновлено только что
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или оружию..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl font-golos text-white placeholder-gray-600 outline-none transition-all focus:border-green-400"
          style={{
            background: "var(--dark-card)",
            border: "1px solid var(--dark-border)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="lg:w-64 flex-shrink-0 space-y-5">
          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Оружие</h3>
            <div className="space-y-1">
              {weapons.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeapon(w)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-golos transition-all ${
                    weapon === w ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                  style={weapon === w ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" } : {}}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Цена ($)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="От"
                className="w-full px-3 py-2 rounded-lg text-sm font-golos text-white placeholder-gray-600 outline-none"
                style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
              />
              <input
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                placeholder="До"
                className="w-full px-3 py-2 rounded-lg text-sm font-golos text-white placeholder-gray-600 outline-none"
                style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
              />
            </div>
          </div>

          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Износ</h3>
            <div className="space-y-1">
              {wears.map((w) => (
                <label key={w} className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked={w === "Все"} />
                  <span className="text-sm font-golos text-gray-400">{w}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Skins grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 font-golos">{filtered.length} скинов</span>
            <div className="flex gap-2">
              {sorts.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wide transition-all ${
                    sort === s ? "" : "text-gray-500 hover:text-white"
                  }`}
                  style={
                    sort === s
                      ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.3)" }
                      : { border: "1px solid var(--dark-border)" }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((skin, i) => (
              <SkinCard key={i} {...skin} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 font-golos">Скины не найдены. Попробуй изменить фильтры.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
