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

  let reply = 'Я помогаю только по вопросам калькулятора: расчёты, подписка, PDF и т.п.';

  if (message.toLowerCase().includes('npv')) {
    reply = 'NPV (чистая приведённая стоимость) — это сумма дисконтированных денежных потоков.';
  } else if (message.toLowerCase().includes('irr')) {
    reply = 'IRR (внутренняя норма доходности) — это ставка доходности проекта.';
  }

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
