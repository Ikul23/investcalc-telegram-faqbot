const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_TOKEN_HERE';

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const message = req.body.message?.text;
  const chatId = req.body.message?.chat?.id;

  if (!message || !chatId) {
    return res.sendStatus(200);
  }

  console.log(`📩 Message from ${chatId}: ${message}`);

  let reply = 'Я помогаю только по вопросам инвестиционного калькулятора investcalc.tech. Вот что я могу объяснить:\n\n';
reply += '📊 Основные показатели: NPV, IRR, DPBP, PP, CIR, ROE, ROI\n';
reply += '📈 Методики расчёта: дисконтирование, амортизация, налоговые режимы\n';
reply += '📑 Формирование отчётов: PDF, структура капитала\n';
reply += '💳 Подписка и доступы\n\n';
reply += 'Напишите название показателя или тему, например: "Как считается NPV?"';

// Подробные объяснения показателей
if (message.toLowerCase().includes('npv') || message.toLowerCase().includes('чист')) {
    reply = `📌 *NPV (Net Present Value) - Чистая приведённая стоимость*\n
🔹 *Формула*: 
NPV = ∑ (CFₜ / (1 + r)ᵗ) - I
где:
CFₜ - денежный поток в период t
r - ставка дисконтирования (${CashflowController.DISCOUNT_RATE}% в нашем калькуляторе)
I - начальные инвестиции

🔸 *Что показывает*:
Сумма всех будущих денежных потоков, приведённых к текущей стоимости. Если NPV > 0 - проект прибыльный.

💡 *Пример*: 
При инвестициях 1 000 000₽ и NPV 250 000₽ - проект создаёт эту дополнительную стоимость`;

} else if (message.toLowerCase().includes('irr') || message.toLowerCase().includes('внутренн')) {
    reply = `📌 *IRR (Internal Rate of Return) - Внутренняя норма доходности*\n
🔹 *Формула*: 
Ставка r, при которой NPV = 0

🔸 *Что показывает*:
Фактическую доходность проекта в %. Сравнивается со ставкой дисконтирования (${CashflowController.DISCOUNT_RATE}%).

💡 *Правило*: 
Если IRR > ставки дисконтирования - проект стоит принимать`;

} else if (message.toLowerCase().includes('dpbp') || message.toLowerCase().includes('дисконт')) {
    reply = `📌 *DPBP (Discounted Payback Period) - Дисконтированный срок окупаемости*\n
🔹 *Формула*: 
Период, когда ∑ дисконтированных CFₜ ≥ I

🔸 *Что показывает*:
За сколько лет окупятся инвестиции с учётом стоимости денег во времени`;

} else if (message.toLowerCase().includes('pp') || message.toLowerCase().includes('окупаемость')) {
    reply = `📌 *PP (Payback Period) - Простой срок окупаемости*\n
🔹 *Формула*: 
Период, когда ∑ CFₜ ≥ I (без дисконтирования)

🔸 *Отличие от DPBP*:
Не учитывает изменение стоимости денег со временем`;

} else if (message.toLowerCase().includes('cir') || message.toLowerCase().includes('коэффициент')) {
    reply = `📌 *CIR (Capital Investment Ratio) - Коэффициент инвестиций*\n
🔹 *Формула*: 
CIR = (Total OPEX / Total Revenue) × 100%

🔸 *Что показывает*:
Долю операционных расходов в выручке. Чем ниже - тем эффективнее управление`;

} else if (message.toLowerCase().includes('roe') || message.toLowerCase().includes('доходность')) {
    reply = `📌 *ROE (Return on Equity) - Доходность собственного капитала*\n
🔹 *Формула*: 
ROE = (Net Income / Equity) × 100%

🔸 *Что показывает*:
Эффективность использования средств инвестора`;

} else if (message.toLowerCase().includes('roi') || message.toLowerCase().includes('отдача')) {
    reply = `📌 *ROI (Return on Investment) - Окупаемость инвестиций*\n
🔹 *Формула*: 
ROI = (Total Profit / Investment) × 100%

🔸 *Что показывает*:
Общую прибыльность проекта за весь период`;

} else if (message.toLowerCase().includes('капитал') || message.toLowerCase().includes('структур')) {
    reply = `📌 *Структура капитала*\n
🔹 *Формула*: 
Долг = Общие инвестиции × Доля заёмных средств
Собственные средства = Общие инвестиции × Доля собственных средств

🔸 *Что показывает*:
Соотношение заёмных и собственных средств в проекте`;

} else if (message.toLowerCase().includes('налог') || message.toLowerCase().includes('режим')) {
    reply = `📌 *Налоговые режимы*\n
Доступные варианты:
• ОСНО (20% налог на прибыль)
• УСН "Доходы" (6% с выручки)
• УСН "Доходы-Расходы" (15% с прибыли)
• ИТ (5% с прибыли для IT-компаний)`;

} else if (message.toLowerCase().includes('pdf') || message.toLowerCase().includes('отчёт')) {
    reply = `📌 *Формирование PDF-отчёта*\n
Отчёт включает:
1. Все финансовые показатели
2. Денежные потоки по годам
3. Графики динамики
4. Структуру капитала

💡 Для генерации нажмите "Экспорт PDF" в калькуляторе`;


} else if (message.toLowerCase().includes('подписк') || message.toLowerCase().includes('оплат') || message.toLowerCase().includes('доступ')) {
  reply = `💳 *Подписка и доступы*\n
🔹 *Способы оплаты*:
1. ЮMoney (банковские карты, кошелек)
2. СБП (Система быстрых платежей)
3. Ручной перевод (для юр. лиц)

🔸 *Стоимость*: 299₽/месяц

📌 *Процесс оплаты*:
1. Выбираете способ оплаты в личном кабинете
2. Совершаете платеж (автоматически или по реквизитам)
3. Получаете уведомление об успешной оплате
4. Доступ активируется в течение 1 часа

💡 *Особенности*:
• При оплате через ЮMoney проверка происходит автоматически
• Для СБП и ручных переводов требуется проверка администратором (до 24 часов)
• Все платежи защищены криптографической подписью

🔄 *Отмена подписки*:
Доступ можно отменить в любой момент в личном кабинете

📊 *Наши реквизиты*:
ИП Иванов И.И.
ИНН 503114886712
Банк: ВТБ (Москва)
Счет: 40802810706030000924
БИК: 044525411

❓ *Проблемы с оплатой?* 
Опишите ситуацию и мы оперативно поможем!`;
}

// Добавляем стандартное форматирование
reply = reply.replace(/\n/g, '\n').replace(/\*/g, '*');
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: reply + '\n\n🤖 _Powered by ChatGPT_',
    parse_mode: 'Markdown',
  });

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('🤖 FAQ Bot is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Bot server running on port ${PORT}`);
});
