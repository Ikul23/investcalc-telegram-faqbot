<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$telegramToken = $_ENV['TELEGRAM_TOKEN'] ?? '';
$openaiToken   = $_ENV['OPENAI_API_KEY'] ?? '';
$logFile       = __DIR__ . '/logs/bot.log';

// Получаем тело запроса (Webhook payload)
$input = file_get_contents('php://input');
$data  = json_decode($input, true);

file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] Incoming: " . $input . "\n", FILE_APPEND);

$message = $data['message']['text'] ?? null;
$chatId  = $data['message']['chat']['id'] ?? null;

if (!$message || !$chatId) {
  http_response_code(200);
  exit('OK');
}

// Если /stats — (заглушка, пока без базы)
if (trim($message) === '/stats') {
  $replyText = "📊 Статистика пока недоступна (мини-бот).";
  sendTelegramMessage($telegramToken, $chatId, $replyText);
  exit('OK');
}

// Запрос к OpenAI
$response = sendToOpenAI($openaiToken, $message);

$reply = $response ?? 'Извините, не понял вопрос.';

sendTelegramMessage($telegramToken, $chatId, $reply . "\n\n🤖 _Powered by ChatGPT_");

http_response_code(200);
exit('OK');

// === Функции ===

function sendTelegramMessage($token, $chatId, $text)
{
  file_get_contents("https://api.telegram.org/bot{$token}/sendMessage?" . http_build_query([
    'chat_id'    => $chatId,
    'text'       => $text,
    'parse_mode' => 'Markdown'
  ]));
}

function sendToOpenAI($apiKey, $message)
{
  $postData = [
    'model'    => 'gpt-3.5-turbo',
    'messages' => [
      [
        'role'    => 'system',
        'content' => 'Ты AI-помощник инвестиционного калькулятора. Отвечай кратко и по делу. Если вопрос вне темы, говори: "Я помогаю только по вопросам калькулятора: расчёты, подписка, PDF и т.п."',
      ],
      [
        'role'    => 'user',
        'content' => $message,
      ],
    ],
  ];

  $ch = curl_init('https://api.openai.com/v1/chat/completions');
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    "Authorization: Bearer {$apiKey}",
  ]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

  $result = curl_exec($ch);
  curl_close($ch);

  $data = json_decode($result, true);

  return $data['choices'][0]['message']['content'] ?? null;
}
