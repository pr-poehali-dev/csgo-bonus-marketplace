import Icon from "@/components/ui/icon";

const team = [
  { name: "Алексей К.", role: "CEO & Основатель", emoji: "🚀" },
  { name: "Мария Л.", role: "Head of Product", emoji: "⚡" },
  { name: "Дмитрий Т.", role: "Lead Developer", emoji: "💻" },
  { name: "Анна С.", role: "Community Manager", emoji: "🎮" },
];

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-16">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-rajdhani font-bold uppercase tracking-wider mb-6"
          style={{ border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)", background: "rgba(0,212,255,0.05)" }}
        >
          ⭐ С нами с 2022 года
        </div>
        <h1 className="text-5xl font-rajdhani font-bold text-white mb-4">
          О <span className="gradient-text">SkinVault</span>
        </h1>
        <p className="text-gray-400 font-golos text-lg leading-relaxed max-w-2xl mx-auto">
          Мы создали SkinVault, потому что сами были игроками и устали от разрозненных данных о ценах на скины. 
          Сегодня мы — крупнейший агрегатор цен и маркетплейс скинов CS2 в СНГ.
        </p>
      </div>

      {/* Mission */}
      <div className="card-dark rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: "var(--neon-green)", filter: "blur(60px)", transform: "translate(30%, -30%)" }} />
        <Icon name="Target" size={32} className="mb-4" style={{ color: "var(--neon-green)" }} />
        <h2 className="text-2xl font-rajdhani font-bold text-white mb-3">Наша миссия</h2>
        <p className="text-gray-400 font-golos leading-relaxed">
          Сделать торговлю скинами CS2 прозрачной, безопасной и выгодной для каждого игрока. 
          Мы агрегируем данные с 12 крупнейших платформ, предоставляем аналитику в реальном времени 
          и помогаем находить лучшие цены за секунды.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: "Shield", title: "Безопасность", desc: "Проверяем все скины и платформы. Никаких фейков.", color: "var(--neon-green)" },
          { icon: "Zap", title: "Скорость", desc: "Данные обновляются каждые 30 секунд в реальном времени.", color: "var(--neon-cyan)" },
          { icon: "Heart", title: "Сообщество", desc: "120,000+ игроков доверяют нам ежемесячно.", color: "var(--neon-purple)" },
        ].map((v, i) => (
          <div key={i} className="card-dark card-hover rounded-xl p-6 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}
            >
              <Icon name={v.icon} size={24} style={{ color: v.color }} />
            </div>
            <h3 className="text-lg font-rajdhani font-bold text-white mb-2">{v.title}</h3>
            <p className="text-sm text-gray-500 font-golos">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-rajdhani font-bold text-white mb-6 text-center">Команда</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((m, i) => (
            <div key={i} className="card-dark card-hover rounded-xl p-5 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl"
                style={{ background: "rgba(0,255,136,0.08)" }}
              >
                {m.emoji}
              </div>
              <div className="font-rajdhani font-bold text-white">{m.name}</div>
              <div className="text-xs text-gray-500 font-golos mt-1">{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
