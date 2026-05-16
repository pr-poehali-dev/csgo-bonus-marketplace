import { useState } from "react";
import Icon from "@/components/ui/icon";

interface PriceAlertModalProps {
  skinName: string;
  skinWeapon?: string;
  currentPrice?: number;
  onClose: () => void;
  onSave: (targetPrice: number) => Promise<{ ok?: boolean; error?: string }>;
}

const PriceAlertModal = ({ skinName, skinWeapon, currentPrice, onClose, onSave }: PriceAlertModalProps) => {
  const [price, setPrice] = useState(currentPrice ? (currentPrice * 0.9).toFixed(2) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(price);
    if (!val || val <= 0) { setError("Введи корректную цену"); return; }
    setLoading(true);
    setError("");
    const result = await onSave(val);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-fade-in"
        style={{ background: "var(--dark-card)", border: "1px solid rgba(0,255,136,0.25)" }}
      >
        {success ? (
          <div className="text-center py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(0,255,136,0.15)" }}
            >
              <Icon name="CheckCircle" size={28} style={{ color: "var(--neon-green)" }} />
            </div>
            <p className="font-rajdhani font-bold text-white text-lg">Алерт создан!</p>
            <p className="text-gray-500 font-golos text-sm mt-1">Уведомим, когда цена упадёт до ${parseFloat(price).toFixed(2)}</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-rajdhani font-bold text-white text-lg leading-tight">Уведомление о цене</h3>
                <p className="text-gray-500 font-golos text-sm mt-0.5 truncate max-w-[220px]">
                  {skinWeapon && <span className="text-gray-600">{skinWeapon} | </span>}{skinName}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors ml-2">
                <Icon name="X" size={18} />
              </button>
            </div>

            {currentPrice && (
              <div
                className="flex items-center justify-between rounded-xl px-4 py-2.5 mb-4"
                style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
              >
                <span className="text-sm text-gray-500 font-golos">Текущая цена</span>
                <span className="font-rajdhani font-bold text-white">${currentPrice.toFixed(2)}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-rajdhani font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Целевая цена ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-rajdhani font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    autoFocus
                    className="w-full pl-8 pr-4 py-3 rounded-xl font-rajdhani font-bold text-lg text-white placeholder-gray-700 outline-none transition-all"
                    style={{ background: "var(--dark-bg)", border: `1px solid ${error ? "#ef4444" : "var(--dark-border)"}` }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
                    onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "var(--dark-border)")}
                  />
                </div>
                {error && <p className="text-xs text-red-400 font-golos mt-1">{error}</p>}
              </div>

              {currentPrice && parseFloat(price) > 0 && (
                <div
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-golos"
                  style={{
                    background: parseFloat(price) < currentPrice ? "rgba(0,255,136,0.08)" : "rgba(255,107,53,0.08)",
                    color: parseFloat(price) < currentPrice ? "var(--neon-green)" : "var(--neon-orange)",
                  }}
                >
                  <Icon name={parseFloat(price) < currentPrice ? "TrendingDown" : "TrendingUp"} size={13} />
                  {parseFloat(price) < currentPrice
                    ? `Скидка ${(((currentPrice - parseFloat(price)) / currentPrice) * 100).toFixed(1)}% от текущей цены`
                    : "Цель выше текущей — алерт сработает сразу"}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--dark-bg)", borderTopColor: "transparent" }} />
                ) : (
                  <Icon name="Bell" size={15} />
                )}
                {loading ? "Сохраняю..." : "Создать уведомление"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceAlertModal;
