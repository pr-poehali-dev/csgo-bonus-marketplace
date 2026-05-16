import { useState } from "react";
import Icon from "@/components/ui/icon";

const contacts = [
  { icon: "Mail", label: "Email", value: "support@skinvault.gg", color: "var(--neon-green)" },
  { icon: "MessageCircle", label: "Telegram", value: "@SkinVaultSupport", color: "var(--neon-cyan)" },
  { icon: "Twitter", label: "Twitter / X", value: "@SkinVault_gg", color: "var(--neon-purple)" },
  { icon: "Youtube", label: "YouTube", value: "SkinVault Official", color: "var(--neon-orange)" },
];

const ContactsPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-rajdhani font-bold text-white mb-2">📬 Контакты</h1>
        <p className="text-gray-500 font-golos">Мы всегда на связи. Отвечаем в течение 2 часов.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card-dark rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-10">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(0,255,136,0.15)" }}
              >
                <Icon name="CheckCircle" size={32} style={{ color: "var(--neon-green)" }} />
              </div>
              <h3 className="text-xl font-rajdhani font-bold text-white mb-2">Сообщение отправлено!</h3>
              <p className="text-gray-500 font-golos text-sm">Мы ответим в течение 2 часов.</p>
              <button className="btn-outline-neon px-4 py-2 rounded-lg text-sm mt-4" onClick={() => setSent(false)}>
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-rajdhani font-bold text-white mb-5">Написать нам</h2>
              {[
                { field: "name", label: "Имя", placeholder: "Твоё имя", type: "text" },
                { field: "email", label: "Email", placeholder: "your@email.com", type: "email" },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-xs font-rajdhani font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder}
                    required
                    className="w-full px-4 py-3 rounded-xl font-golos text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-rajdhani font-bold uppercase tracking-wider text-gray-500 mb-1.5">Сообщение</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Опиши свой вопрос..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl font-golos text-white placeholder-gray-600 outline-none transition-all resize-none"
                  style={{ background: "var(--dark-bg)", border: "1px solid var(--dark-border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--neon-green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--dark-border)")}
                />
              </div>
              <button type="submit" className="btn-neon w-full py-3 rounded-xl text-base">
                Отправить сообщение
              </button>
            </form>
          )}
        </div>

        {/* Contacts */}
        <div className="space-y-4">
          <div className="card-dark rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-golos text-gray-400">Среднее время ответа</span>
            </div>
            <div className="text-3xl font-rajdhani font-bold" style={{ color: "var(--neon-green)" }}>~47 минут</div>
          </div>

          {contacts.map((c, i) => (
            <div key={i} className="card-dark card-hover rounded-xl p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}
              >
                <Icon name={c.icon} size={20} style={{ color: c.color }} />
              </div>
              <div>
                <div className="text-xs text-gray-600 font-golos uppercase tracking-wider">{c.label}</div>
                <div className="text-sm font-golos font-medium text-white">{c.value}</div>
              </div>
              <Icon name="ExternalLink" size={14} className="ml-auto text-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
