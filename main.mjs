import { sendMessageToLINE, formatDataToMessage } from "./sendMessageToLINE.mjs";
import { samuraiList } from "./database.mjs";
import { scrapeToArray } from "./scrape.mjs";
import { convertToDate } from "./convertToDate.mjs";

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

const testYoshida = async () => {
  const yoshida = samuraiList.find((e) => e.name === "吉田 正尚");
  scrapeAndFormatMessage(yoshida.url, yoshida.selector);
};

// NOTE: 最新の試合順に並べる
const testAllPlayerAllStatsSorted = async () => {
  let sortArray = [];
  for (let i in samuraiList) {
    sortArray.push(await scrapeToArray(samuraiList[i].url, samuraiList[i].selector));
  }

  sortArray.sort((a, b) => convertToDate(a.recentStats.日付) - convertToDate(b.recentStats.日付));
  for (let i in sortArray) {
    const formatedData = formatDataToMessage(sortArray[i]);
    console.log("---------------------------");
    console.log(formatedData);
    console.log("---------------------------");
  }
};

//---------------------------
// NOTE: テストの実行
//---------------------------

testAllPlayerAllStatsSorted();
