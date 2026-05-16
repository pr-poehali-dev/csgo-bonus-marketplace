import { useState } from "react";
import Icon from "@/components/ui/icon";

const faqs = [
  {
    q: "Как купить скин на SkinVault?",
    a: "Зайди на страницу Маркетплейс, найди нужный скин с помощью поиска или фильтров, нажми «Купить» и следуй инструкциям. Для покупки необходимо войти через Steam."
  },
  {
    q: "Безопасно ли торговать на SkinVault?",
    a: "Да. Мы работаем только с проверенными партнёрскими платформами и используем официальный Steam API. Все транзакции защищены. Мы никогда не запрашиваем данные твоей учётной записи Steam."
  },
  {
    q: "Как работает сравнение цен?",
    a: "Мы агрегируем данные с 12 крупнейших торговых площадок: Steam, DMarket, Skinport, CS.Money, BitSkins, Waxpeer и других. Цены обновляются каждые 30 секунд в реальном времени."
  },
  {
    q: "Что такое бонус коды?",
    a: "Это промокоды от наших партнёрских платформ. Вводи их при регистрации или пополнении на соответствующей площадке и получай бонусы — дополнительный баланс, скидки или VIP-статус."
  },
  {
    q: "Как настроить уведомления о цене?",
    a: "Зайди в профиль (требуется авторизация через Steam), найди нужный скин и нажми «Уведомить меня». Укажи целевую цену — мы пришлём уведомление когда скин достигнет нужной стоимости."
  },
  {
    q: "Сколько стоит использование SkinVault?",
    a: "SkinVault полностью бесплатен для пользователей. Мы зарабатываем только на партнёрских программах с торговыми площадками, не берём комиссию с твоих сделок."
  },
  {
    q: "Какие методы оплаты поддерживаются?",
    a: "Методы оплаты зависят от выбранной торговой площадки. Большинство платформ поддерживают банковские карты, криптовалюту, Steam баланс и различные электронные кошельки."
  },
  {
    q: "Как обратиться в поддержку?",
    a: "Напиши нам на странице «Контакты» или в Telegram @SkinVaultSupport. Мы отвечаем в течение 2 часов в рабочие дни."
  },
];

const FAQPage = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-rajdhani font-bold text-white mb-2">Частые вопросы</h1>
        <p className="text-gray-500 font-golos">Всё, что ты хотел знать о SkinVault</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="card-dark rounded-xl overflow-hidden transition-all duration-200"
            style={{ border: `1px solid ${open === i ? "rgba(0,255,136,0.25)" : "var(--dark-border)"}` }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-all"
            >
              <span className="font-golos font-semibold text-white">{faq.q}</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: open === i ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)",
                  color: open === i ? "var(--neon-green)" : "#666",
                  transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <Icon name="ChevronDown" size={14} />
              </div>
            </button>

            {open === i && (
              <div className="px-5 pb-5">
                <div className="h-px mb-4" style={{ background: "var(--dark-border)" }} />
                <p className="text-gray-400 font-golos leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 card-dark rounded-2xl p-6 text-center">
        <h3 className="text-lg font-rajdhani font-bold text-white mb-2">Не нашёл ответ?</h3>
        <p className="text-sm text-gray-500 font-golos mb-4">Напиши нам — ответим в течение 2 часов</p>
        <button className="btn-neon px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 mx-auto">
          <Icon name="MessageCircle" size={16} />
          Написать в поддержку
        </button>
      </div>
    </div>
  );
};

export default FAQPage;
