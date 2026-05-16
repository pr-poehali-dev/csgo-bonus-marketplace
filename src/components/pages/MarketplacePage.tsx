import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import SkinCard from "@/components/SkinCard";
import { useSteamMarket } from "@/hooks/useSteamMarket";

const weapons = ["Все", "AK-47", "AWP", "M4A4", "M4A1-S", "Desert Eagle", "USP-S", "Glock-18", "P250", "Tec-9", "Five-SeveN", "★ Karambit", "★ Butterfly Knife", "★ Bayonet", "★ M9 Bayonet", "★ Huntsman Knife", "★ Sport Gloves"];
const rarities = [
  { id: "Все", label: "Все" },
  { id: "covert", label: "Тайное" },
  { id: "classified", label: "Засекреченное" },
  { id: "restricted", label: "Запрещённое" },
  { id: "milspec", label: "Армейское" },
];
const wears = ["Все", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
const sorts = [
  { id: "popular", label: "Популярные" },
  { id: "price_asc", label: "Цена ↑" },
  { id: "price_desc", label: "Цена ↓" },
  { id: "volume", label: "Объём" },
];

interface MarketplacePageProps {
  onAlert?: (name: string, weapon: string, price: number) => void;
}

const MarketplacePage = ({ onAlert }: MarketplacePageProps) => {
  const { skins, loading, error, total, fetchList } = useSteamMarket();
  const [searchText, setSearchText] = useState("");
  const [weapon, setWeapon] = useState("Все");
  const [rarity, setRarity] = useState("Все");
  const [wear, setWear] = useState("Все");
  const [sort, setSort] = useState<"popular" | "price_asc" | "price_desc" | "volume">("popular");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = useCallback(() => {
    fetchList({
      search: searchText.trim(),
      weapon: weapon === "Все" ? undefined : weapon,
      rarity: rarity === "Все" ? undefined : rarity,
      wear: wear === "Все" ? undefined : wear,
      min_price: priceFrom,
      max_price: priceTo,
      sort,
      limit: 60,
    });
  }, [searchText, weapon, rarity, wear, priceFrom, priceTo, sort, fetchList]);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weapon, rarity, wear, sort]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(reload, 500);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, priceFrom, priceTo]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-rajdhani font-bold text-white mb-1">Маркетплейс</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-gray-500 font-golos text-sm">
              База Steam Market · {total} скинов в каталоге
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Поиск — AK-47 Asiimov, Karambit Doppler, AWP Dragon Lore..."
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
        <aside className="lg:w-56 flex-shrink-0 space-y-4">
          <div className="card-dark rounded-xl p-4">
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Оружие</h3>
            <div className="space-y-0.5 max-h-72 overflow-y-auto">
              {weapons.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeapon(w)}
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
            <h3 className="font-rajdhani font-bold text-white uppercase tracking-wider text-sm mb-3">Редкость</h3>
            <div className="space-y-0.5">
              {rarities.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRarity(r.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-golos transition-all"
                  style={rarity === r.id
                    ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }
                    : { color: "#6b7280" }}
                >
                  {r.label}
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

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-sm text-gray-500 font-golos">
              {loading ? "Загрузка..." : `${skins.length} ${total > skins.length ? `из ${total}` : ""} скинов`}
            </span>
            <div className="flex gap-2 flex-wrap">
              {sorts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id as typeof sort)}
                  className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wide transition-all"
                  style={sort === s.id
                    ? { background: "rgba(0,255,136,0.1)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.3)" }
                    : { border: "1px solid var(--dark-border)", color: "#6b7280" }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl p-4 mb-4 text-sm font-golos" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              {error}
            </div>
          )}

          {loading && skins.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-xl h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          )}

          {!loading && skins.length === 0 && !error && (
            <div className="text-center py-20">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 font-golos">Скины не найдены. Попробуй другие фильтры.</p>
            </div>
          )}

          {skins.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skins.map((skin, i) => (
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
