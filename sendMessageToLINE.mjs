import line from "@line/bot-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const sendMessageToLINE = (messageText) => {
  const config = { channelAccessToken: process.env.ACCESS_TOKEN };

  const client = new line.Client(config);

  client
    .broadcast({ type: "text", text: messageText }) //NOTE: 個別で送る場合はpushMessageメソッドを使う。引数は(userID, message)
    .then(() => {
      console.log("Message was sent successfully");
    })
    .catch((err) => {
      console.error("An error occurred while sending message:", err);
    });
};
const formatDataToMessage = (scrapedData) => {
  // TODO: updateDateと日付を比較し、「最近の試合なら」「今現在試合中の可能性があるなら」などで分岐（変数を設置して、文の中で分岐するのが良さそう）
  // TODO: 日付判断関数をモジュール化
  if (scrapedData.updateDate) {
  }
  let returnText = "";

  //NOTE: 打者か投手かの判別。
  if ("打席結果" in scrapedData.recentStats) {
    returnText = `${scrapedData.playerName}は${scrapedData.recentStats.日付}の試合に出場。\n成績は「${scrapedData.recentStats.打席結果}」でした。`;
  } else {
    returnText = `${scrapedData.playerName}は${scrapedData.recentStats.日付}の試合に出場。${
      scrapedData.recentStats.投球回
    }回を投げ、失点は${scrapedData.recentStats.失点}、自責点は${
      scrapedData.recentStats.自責点
    } でした。\n詳細な成績→ 被安打:${scrapedData.recentStats.被安打} 被本塁打:${
      scrapedData.recentStats.被本塁打
    } 奪三振:${scrapedData.recentStats.奪三振} 与四死球:${
      Number(scrapedData.recentStats.与四球) + Number(scrapedData.recentStats.与死球)
    }`;
  }
  return returnText;
};

export { sendMessageToLINE, formatDataToMessage };
