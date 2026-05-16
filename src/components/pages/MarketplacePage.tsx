import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import SkinCard from "@/components/SkinCard";
import { useSteamMarket } from "@/hooks/useSteamMarket";

const weapons = ["Все", "AK-47", "AWP", "M4A4", "M4A1-S", "Glock-18", "USP-S", "Desert Eagle", "Karambit", "M9 Bayonet", "Butterfly Knife"];
const wears = ["Все", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
const sorts = ["Цена ↑", "Цена ↓", "Популярные", "Объём"];

interface MarketplacePageProps {
  onAlert?: (name: string, weapon: string, price: number) => void;
}

const MarketplacePage = ({ onAlert }: MarketplacePageProps) => {
  const { skins, loading, error, fetchPopular, search } = useSteamMarket();
  const [searchText, setSearchText] = useState("");
  const [weapon, setWeapon] = useState("Все");
  const [wear, setWear] = useState("Все");
  const [sort, setSort] = useState("Популярные");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (weapon !== "Все") {
      fetchPopular(50);
    } else if (!searchText) {
      fetchPopular(50);
    }
  }, []);

  // Дебаунс поиска
  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    if (searchTimer) clearTimeout(searchTimer);
    if (!value.trim()) {
      fetchPopular(50);
      return;
    }
    const timer = setTimeout(() => {
      search(value.trim(), 0, 50);
    }, 600);
    setSearchTimer(timer);
  }, [searchTimer, fetchPopular, search]);

  const handleWeaponClick = (w: string) => {
    setWeapon(w);
    setSearchText("");
    if (w === "Все") {
      fetchPopular(50);
    } else {
      search(w, 0, 50);
    }
  };

  // Локальная фильтрация поверх данных от Steam
  const filtered = skins.filter((s) => {
    const matchWeapon = weapon === "Все" || s.weapon.toLowerCase().includes(weapon.toLowerCase());
    const matchWear = wear === "Все" || s.wear === wear;
    const matchFrom = !priceFrom || s.price >= parseFloat(priceFrom);
    const matchTo = !priceTo || s.price <= parseFloat(priceTo);
    return matchWeapon && matchWear && matchFrom && matchTo;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Цена ↑") return a.price - b.price;
    if (sort === "Цена ↓") return b.price - a.price;
    if (sort === "Объём") return (b.volume || 0) - (a.volume || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-rajdhani font-bold text-white mb-1">Маркетплейс</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-gray-500 font-golos text-sm">
              Данные Steam Market · {filtered.length} скинов
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Поиск по Steam Market — AK-47, AWP Dragon Lore..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl font-golos text-white placeholder-gray-600 outline-none transition-all"
          style={{ background: "var(--dark-card)", border: "1px solid var(--dark-border)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
        />
        {loading && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--neon-green)", borderTopColor: "transparent" }}
          />
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0 space-y-4">
          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Оружие</h3>
            <div className="space-y-0.5">
              {weapons.map((w) => (
                <button
                  key={w}
                  onClick={() => handleWeaponClick(w)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-golos transition-all"
                  style={weapon === w
                    ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }
                    : { color: "#6b7280" }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Цена ($)</h3>
            <div className="flex gap-2">
              <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="От" className="w-full px-3 py-2 rounded-lg text-sm font-golos text-white placeholder-gray-600 outline-none"
                style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }} />
              <input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)}
                placeholder="До" className="w-full px-3 py-2 rounded-lg text-sm font-golos text-white placeholder-gray-600 outline-none"
                style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }} />
            </div>
          </div>

          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Износ</h3>
            <div className="space-y-0.5">
              {wears.map((w) => (
                <button
                  key={w}
                  onClick={() => setWear(w)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-golos transition-all"
                  style={wear === w
                    ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }
                    : { color: "#6b7280" }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-sm text-gray-500 font-golos">{sorted.length} скинов из Steam Market</span>
            <div className="flex gap-2 flex-wrap">
              {sorts.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wide transition-all"
                  style={sort === s
                    ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.3)" }
                    : { border: "1px solid var(--dark-border)", color: "#6b7280" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl p-4 mb-4 text-sm font-golos" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Skeleton */}
          {loading && sorted.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          )}

          {/* Skins grid */}
          {!loading && sorted.length === 0 && !error && (
            <div className="text-center py-20">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 font-golos">Скины не найдены. Попробуй другой запрос.</p>
            </div>
          )}

          {sorted.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sorted.map((skin, i) => (
                <SkinCard
                  key={skin.hash_name || i}
                  name={skin.name}
                  weapon={skin.weapon}
                  price={skin.price}
                  wear={skin.wear}
                  rarity={skin.rarity}
                  image={skin.image}
                  onAlert={onAlert}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
