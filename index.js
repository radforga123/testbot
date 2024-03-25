const TgAPi = require("node-telegram-bot-api");
const { GameOptions, AgainOptions } = require("./options");

const token = "5514555185:AAFCoKbvSNlobLSc7JnjcfPdu1qFr5_0-1A";

const chats = {};

const bot = new TgAPi(token, { polling: true });

const startGame = (ChatID) => {
  bot.sendMessage(ChatID, "Попробуй угадать число от 0 до 9");
  const RandomNumber = Math.floor(Math.random() * 10);

  chats[ChatID] = RandomNumber;
  return bot.sendMessage(ChatID, "Отгадывай", GameOptions);
};
const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвие" },
    { command: "/info", description: "Краткая инфа о человеке" },
    { command: "/game", description: "Отгадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const ChatID = msg.chat.id;
    if (text == "/start") {
      await bot.sendSticker(
        ChatID,
        "https://chpic.su/_data/stickers/e/Eeveelotions/Eeveelotions_001.webp?v=1711342504"
      );
      return bot.sendMessage(
        ChatID,
        `Добро пожаловать в телеграм бот викторину`
      );
    }
    if (text == "/info") {
      return bot.sendMessage(
        ChatID,
        `Твоё имя ${msg.from.first_name} и фамилия ${msg.from.last_name}`
      );
    }

    if (text == "/game") {
      startGame(ChatID);
      return 0;
    }

    return bot.sendMessage(ChatID, "Введена несуществующая команда");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const ChatID = msg.message.chat.id;

    if (data === "/again") {
      return startGame(ChatID);
    }
    if (data == chats[ChatID]) {
      return bot.sendMessage(
        ChatID,
        `Поздравляю ты отгадал цифру ${data}`,
        AgainOptions
      );
    } else {
      return bot.sendMessage(
        ChatID,
        `Ты не отгадал цифру ${chats[ChatID]}`,
        AgainOptions
      );
    }
  });
};

start();
