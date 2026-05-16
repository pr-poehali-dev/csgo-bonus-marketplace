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
}

const rarityLabels: Record<string, string> = {
  covert: "Тайное",
  classified: "Засекреченное",
  restricted: "Запрещённое",
  milspec: "Армейское",
};

const SkinCard = ({ name, weapon, price, oldPrice, wear, rarity, image, trending, discount }: SkinCardProps) => {
  return (
    <div
      className={`card-dark card-hover rounded-xl overflow-hidden cursor-pointer rarity-${rarity}`}
    >
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
        <img
          src={image}
          alt={name}
          className="h-36 w-full object-contain float"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="text-xs text-gray-500 font-golos uppercase tracking-wide">{weapon}</div>
            <div className="text-sm font-golos font-semibold text-white leading-tight">{name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 font-golos">{rarityLabels[rarity]}</span>
          <span className="text-xs text-gray-600">•</span>
          <span className="text-xs text-gray-500 font-golos">{wear}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-lg font-rajdhani font-bold"
              style={{ color: "var(--neon-green)" }}
            >
              ${price.toFixed(2)}
            </div>
            {oldPrice && (
              <div className="text-xs text-gray-600 line-through font-golos">${oldPrice.toFixed(2)}</div>
            )}
          </div>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wider transition-all duration-200 btn-neon"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinCard;
