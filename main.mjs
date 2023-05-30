import { sendMessageToLINE, formatDataToMessage } from "./sendMessageToLINE.mjs";
import { samuraiList } from "./database.mjs";
import { scrapeToArray } from "./scrape.mjs";

// TODO: 試合が最新の順に並べる。
/*
scrapeToArrayを受け取り、scrapeData.recentStats.日付で並べ替え、formatDataToMessageに渡す。Lineの仕組み的に、最新のものを最後にする。
*/

//---------------------------
//NOTE: テストコード
//---------------------------

const scrapeAndSendMessage = async (url, cssSelector) => {
  const scrapedData = await scrapeToArray(url, cssSelector);
  const formatedData = formatDataToMessage(scrapedData);
  sendMessageToLINE(formatedData);
};

const scrapeAndFormatMessage = async (url, cssSelector) => {
  const scrapedData = await scrapeToArray(url, cssSelector);
  const formatedData = formatDataToMessage(scrapedData);
  console.log("---------------------------");
  console.log(formatedData);
  console.log("---------------------------");
};

const testAllPlayerAllStats = async () => {
  for (let i in samuraiList) {
    scrapeAndFormatMessage(samuraiList[i].url, samuraiList[i].selector);
  }
};
const testYoshida = async () => {
  const yoshida = samuraiList.find((e) => e.name === "吉田 正尚");
  scrapeAndFormatMessage(yoshida.url, yoshida.selector);
};

const testAllPlayerAllStatsSorted = async () => {
  let sortArray = [];
  for (let i in samuraiList) {
    sortArray.push(await scrapeToArray(samuraiList[i].url, samuraiList[i].selector));
  }
  const convertToDate = (str) => {
    let [month, day] = str.replace("月", " ").replace("日", "").split(" ").map(Number);
    let date = new Date();
    date.setFullYear(date.getFullYear()); // 現在の年をセット
    date.setMonth(month - 1); // JavaScriptのDateは0から始まるので1を引く
    date.setDate(day);
    return date;
  };

  sortArray.sort((a, b) => convertToDate(a.recentStats.日付) - convertToDate(b.recentStats.日付));
  for (let i in sortArray) {
    const formatedData = formatDataToMessage(sortArray[i]);
    sendMessageToLINE(formatedData);
  }
};

//---------------------------
// NOTE: テストの実行
//---------------------------

testAllPlayerAllStatsSorted();
