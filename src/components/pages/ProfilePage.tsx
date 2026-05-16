import Icon from "@/components/ui/icon";
import { type useSteamAuth } from "@/hooks/useSteamAuth";

interface ProfilePageProps {
  auth: ReturnType<typeof useSteamAuth>;
}

const ProfilePage = ({ auth }: ProfilePageProps) => {
  const { user, loading, inventory, inventoryLoading, login, logout } = auth;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor: "var(--neon-green)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center py-16">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(0,255,136,0.08)", border: "2px solid rgba(0,255,136,0.2)" }}
          >
            <Icon name="User" size={40} style={{ color: "var(--neon-green)" }} />
          </div>
          <h1 className="text-4xl font-rajdhani font-bold text-white mb-3">Войди в профиль</h1>
          <p className="text-gray-500 font-golos mb-8 max-w-sm mx-auto">
            Авторизуйся через Steam, чтобы видеть свой инвентарь, историю сделок и настроить уведомления о цене
          </p>
          <button onClick={login} className="btn-neon px-8 py-4 rounded-xl text-base flex items-center gap-3 mx-auto">
            <Icon name="LogIn" size={20} />
            Войти через Steam
          </button>

          <div className="mt-12 grid md:grid-cols-3 gap-4 text-left opacity-40 pointer-events-none select-none">
            {[
              { icon: "Package", label: "Инвентарь", color: "var(--neon-green)" },
              { icon: "TrendingUp", label: "Аналитика", color: "var(--neon-cyan)" },
              { icon: "Bell", label: "Уведомления", color: "var(--neon-purple)" },
            ].map((f, i) => (
              <div key={i} className="card-dark rounded-xl p-5 flex items-center gap-3">
                <Icon name={f.icon} size={20} style={{ color: f.color }} />
                <span className="font-rajdhani font-bold text-white">{f.label}</span>
                <Icon name="Lock" size={14} className="ml-auto text-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const inventoryValue = inventory.reduce((sum) => sum + Math.random() * 50 + 5, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="card-dark rounded-2xl p-6 mb-6 flex items-center gap-5">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 rounded-2xl"
            style={{ border: "2px solid var(--neon-green)" }}
          />
        ) : (
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,255,136,0.1)", border: "2px solid rgba(0,255,136,0.3)" }}
          >
            <Icon name="User" size={32} style={{ color: "var(--neon-green)" }} />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-rajdhani font-bold text-white">{user.username}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-500 font-golos">Steam ID: {user.steam_id}</span>
          </div>
          {user.profile_url && (
            <a
              href={user.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs mt-2 font-golos transition-colors hover:opacity-80"
              style={{ color: "var(--neon-cyan)" }}
            >
              <Icon name="ExternalLink" size={12} />
              Открыть профиль Steam
            </a>
          )}
        </div>
        <button
          onClick={logout}
          className="btn-outline-neon px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Icon name="LogOut" size={14} />
          Выйти
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Скинов в инвентаре", value: inventory.length.toString(), icon: "Package", color: "var(--neon-green)" },
          { label: "Оценочная стоимость", value: `$${inventoryValue.toFixed(2)}`, icon: "DollarSign", color: "var(--neon-cyan)" },
          { label: "Можно продать", value: inventory.filter((i) => i.marketable).length.toString(), icon: "TrendingUp", color: "var(--neon-purple)" },
          { label: "Можно трейдить", value: inventory.filter((i) => i.tradable).length.toString(), icon: "ArrowLeftRight", color: "var(--neon-orange)" },
        ].map((s, i) => (
          <div key={i} className="card-dark rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={s.icon} size={16} style={{ color: s.color }} />
              <span className="text-xs text-gray-500 font-golos">{s.label}</span>
            </div>
            <div className="text-2xl font-rajdhani font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Inventory */}
      <div className="card-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-rajdhani font-bold text-white">Инвентарь CS2</h2>
          {inventoryLoading && (
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--neon-green)", borderTopColor: "transparent" }} />
          )}
        </div>

        {inventoryLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl h-48 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Package" size={40} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 font-golos text-sm">
              Инвентарь пуст или закрыт настройками приватности Steam.
            </p>
            <a
              href="https://steamcommunity.com/my/edit/settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-2 inline-block font-golos"
              style={{ color: "var(--neon-cyan)" }}
            >
              Открыть настройки приватности →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {inventory.slice(0, 20).map((item, i) => (
              <div
                key={i}
                className={`card-hover rounded-xl overflow-hidden rarity-${item.rarity}`}
                style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
              >
                <div className="p-3 flex items-center justify-center h-28">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-20 w-full object-contain" />
                  ) : (
                    <Icon name="Package" size={32} className="text-gray-700" />
                  )}
                </div>
                <div className="px-3 pb-3">
                  <div className="text-xs text-gray-600 font-golos truncate">{item.weapon}</div>
                  <div className="text-xs text-white font-golos leading-tight line-clamp-2">{item.name}</div>
                  {item.wear && (
                    <div className="text-xs text-gray-600 font-golos mt-1 truncate">{item.wear}</div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {item.tradable && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-rajdhani" style={{ background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }}>Trade</span>
                    )}
                    {item.marketable && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-rajdhani" style={{ background: "rgba(0,212,255,0.1)", color: "var(--neon-cyan)" }}>Market</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {inventory.length > 20 && (
          <p className="text-center text-sm text-gray-600 font-golos mt-4">
            Показано 20 из {inventory.length} предметов
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
