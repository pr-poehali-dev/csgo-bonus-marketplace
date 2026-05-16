import Icon from "@/components/ui/icon";

const KNIFE_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/7f68def5-e12c-496a-b672-ede0fe35e272.jpg";
const AK_IMG = "https://cdn.poehali.dev/projects/e58516a7-3979-4b02-9f05-3734eb390930/files/6f50d89b-e5fa-4d6f-9e38-998a9aa02d52.jpg";

const inventory = [
  { name: "Doppler Phase 2", weapon: "Karambit", price: 450, image: KNIFE_IMG },
  { name: "Asiimov | FN", weapon: "AK-47", price: 89.99, image: AK_IMG },
];

const activity = [
  { type: "buy", item: "AK-47 | Asiimov", price: 89.99, date: "Сегодня, 14:32" },
  { type: "sell", item: "M4A1-S | Hyper Beast", price: 34.50, date: "Вчера, 09:15" },
  { type: "buy", item: "AWP | Neon Rider", price: 280.00, date: "12 дек, 18:00" },
];

const ProfilePage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Not logged in state */}
      <div className="text-center py-20">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(0,255,136,0.08)", border: "2px solid rgba(0,255,136,0.2)" }}
        >
          <Icon name="User" size={40} style={{ color: "var(--neon-green)" }} />
        </div>
        <h1 className="text-4xl font-rajdhani font-bold text-white mb-3">Войди в профиль</h1>
        <p className="text-gray-500 font-golos mb-8 max-w-sm mx-auto">
          Авторизуйся через Steam, чтобы видеть свой инвентарь, историю сделок и отслеживать уведомления
        </p>
        <button
          className="btn-neon px-8 py-4 rounded-xl text-base flex items-center gap-3 mx-auto"
        >
          <Icon name="LogIn" size={20} />
          Войти через Steam
        </button>

        {/* Preview locked sections */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-left opacity-50 pointer-events-none select-none">
          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Package" size={18} style={{ color: "var(--neon-green)" }} />
              <h3 className="font-rajdhani font-bold text-white">Мой инвентарь</h3>
            </div>
            {inventory.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-t" style={{ borderColor: "var(--dark-border)" }}>
                <img src={item.image} alt={item.name} className="w-12 h-8 object-contain" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 truncate font-golos">{item.weapon}</div>
                  <div className="text-sm text-white font-golos truncate">{item.name}</div>
                </div>
                <span className="text-sm font-rajdhani font-bold" style={{ color: "var(--neon-green)" }}>${item.price}</span>
              </div>
            ))}
          </div>

          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="TrendingUp" size={18} style={{ color: "var(--neon-cyan)" }} />
              <h3 className="font-rajdhani font-bold text-white">Аналитика</h3>
            </div>
            {[
              { label: "Стоимость инвентаря", value: "$1,240.90" },
              { label: "Прибыль за месяц", value: "+$84.50" },
              { label: "Всего сделок", value: "47" },
            ].map((s, i) => (
              <div key={i} className="flex justify-between py-2 border-t" style={{ borderColor: "var(--dark-border)" }}>
                <span className="text-sm text-gray-500 font-golos">{s.label}</span>
                <span className="text-sm font-rajdhani font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="card-dark rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Clock" size={18} style={{ color: "var(--neon-purple)" }} />
              <h3 className="font-rajdhani font-bold text-white">История</h3>
            </div>
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-t" style={{ borderColor: "var(--dark-border)" }}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: a.type === "buy" ? "rgba(0,255,136,0.15)" : "rgba(255,107,53,0.15)" }}
                >
                  <Icon name={a.type === "buy" ? "ArrowDownLeft" : "ArrowUpRight"} size={10} style={{ color: a.type === "buy" ? "var(--neon-green)" : "var(--neon-orange)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white font-golos truncate">{a.item}</div>
                  <div className="text-xs text-gray-600 font-golos">{a.date}</div>
                </div>
                <span className="text-xs font-rajdhani font-bold flex-shrink-0" style={{ color: a.type === "buy" ? "var(--neon-orange)" : "var(--neon-green)" }}>
                  {a.type === "buy" ? "-" : "+"}${a.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
