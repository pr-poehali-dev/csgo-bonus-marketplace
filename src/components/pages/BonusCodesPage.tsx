import { useState } from "react";
import Icon from "@/components/ui/icon";

const codes = [
  { platform: "DMarket", code: "SKINVAULT10", bonus: "+10% на первое пополнение", expires: "31 дек 2024", color: "var(--neon-green)", category: "Пополнение" },
  { platform: "CS.Money", code: "VAULT2024", bonus: "Бесплатный трейд без комиссии", expires: "15 янв 2025", color: "var(--neon-cyan)", category: "Трейд" },
  { platform: "Skinport", code: "SVPORT5", bonus: "Скидка 5% на все покупки", expires: "1 фев 2025", color: "var(--neon-purple)", category: "Скидка" },
  { platform: "BitSkins", code: "SKINVIP", bonus: "VIP статус на 30 дней", expires: "Бессрочно", color: "var(--neon-orange)", category: "VIP" },
  { platform: "Waxpeer", code: "WAX_SV15", bonus: "+15% к балансу при пополнении", expires: "20 янв 2025", color: "var(--neon-green)", category: "Пополнение" },
  { platform: "BUFF163", code: "BUFF_VAULT", bonus: "Комиссия 0% на первые 5 сделок", expires: "28 фев 2025", color: "var(--neon-cyan)", category: "Трейд" },
];

const BonusCodesPage = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-rajdhani font-bold text-white mb-2">🎁 Бонус коды</h1>
        <p className="text-gray-500 font-golos">Эксклюзивные промокоды от наших партнёров — только для пользователей SkinVault</p>
      </div>

      {/* Banner */}
      <div
        className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,212,255,0.1) 100%)", border: "1px solid rgba(0,255,136,0.2)" }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Sparkles" size={22} style={{ color: "var(--neon-green)" }} />
            <span className="font-rajdhani font-bold text-xl text-white">Новый промокод каждую неделю!</span>
          </div>
          <p className="text-gray-400 font-golos text-sm">Подпишись на уведомления, чтобы первым получать эксклюзивные коды</p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-20">🎁</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {codes.map((c, i) => (
          <div key={i} className="card-dark card-hover rounded-xl p-5" style={{ borderTop: `2px solid ${c.color}` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span
                  className="text-xs font-rajdhani font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 inline-block"
                  style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}
                >
                  {c.category}
                </span>
                <h3 className="text-lg font-rajdhani font-bold text-white">{c.platform}</h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 font-golos">
                <Icon name="Clock" size={12} />
                {c.expires}
              </div>
            </div>

            <p className="text-sm text-gray-400 font-golos mb-4">{c.bonus}</p>

            <div
              className="flex items-center justify-between rounded-lg px-4 py-3"
              style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
            >
              <span className="font-rajdhani font-bold text-lg tracking-widest" style={{ color: c.color }}>
                {c.code}
              </span>
              <button
                onClick={() => copy(c.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase transition-all"
                style={
                  copied === c.code
                    ? { background: "rgba(0,255,136,0.2)", color: "var(--neon-green)" }
                    : { background: `${c.color}15`, color: c.color }
                }
              >
                <Icon name={copied === c.code ? "Check" : "Copy"} size={12} />
                {copied === c.code ? "Скопировано!" : "Копировать"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusCodesPage;
