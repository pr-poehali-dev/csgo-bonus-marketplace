import Icon from "@/components/ui/icon";

interface SkinCardProps {
  name: string;
  weapon: string;
  price: number;
  oldPrice?: number;
  wear: string;
  rarity: "covert" | "classified" | "restricted" | "milspec";
  image: string;
  trending?: boolean;
  discount?: number;
  onAlert?: (name: string, weapon: string, price: number) => void;
}

const rarityLabels: Record<string, string> = {
  covert: "Тайное",
  classified: "Засекреченное",
  restricted: "Запрещённое",
  milspec: "Армейское",
};

const SkinCard = ({ name, weapon, price, oldPrice, wear, rarity, image, trending, discount, onAlert }: SkinCardProps) => {
  return (
    <div className={`card-dark card-hover rounded-xl overflow-hidden cursor-pointer rarity-${rarity} relative group`}>
      {/* Image */}
      <div className="relative h-44 flex items-center justify-center p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        {trending && (
          <span
            className="absolute top-3 left-3 text-xs font-rajdhani font-bold uppercase px-2 py-0.5 rounded"
            style={{ background: "var(--neon-green)", color: "var(--dark-bg)" }}
          >
            🔥 Хит
          </span>
        )}
        {discount && (
          <span
            className="absolute top-3 right-3 text-xs font-rajdhani font-bold uppercase px-2 py-0.5 rounded"
            style={{ background: "#ff6b35", color: "white" }}
          >
            -{discount}%
          </span>
        )}
        {/* Bell button — появляется при ховере */}
        {onAlert && (
          <button
            onClick={(e) => { e.stopPropagation(); onAlert(name, weapon, price); }}
            className="absolute bottom-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.3)" }}
            title="Уведомить о цене"
          >
            <Icon name="Bell" size={13} style={{ color: "var(--neon-green)" }} />
          </button>
        )}
        <img src={image} alt={name} className="h-36 w-full object-contain float" />
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="mb-2">
          <div className="text-xs text-gray-500 font-golos uppercase tracking-wide">{weapon}</div>
          <div className="text-sm font-golos font-semibold text-white leading-tight">{name}</div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 font-golos">{rarityLabels[rarity]}</span>
          <span className="text-xs text-gray-600">•</span>
          <span className="text-xs text-gray-500 font-golos">{wear}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-rajdhani font-bold" style={{ color: "var(--neon-green)" }}>
              ${price.toFixed(2)}
            </div>
            {oldPrice && (
              <div className="text-xs text-gray-600 line-through font-golos">${oldPrice.toFixed(2)}</div>
            )}
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wider transition-all duration-200 btn-neon">
            Купить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinCard;
