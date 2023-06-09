import axios from "axios";
import { load as loadByCheerio } from "cheerio";

const returnHTML = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const scrapeToArray = async (url, cssSelectorArray) => {
  const html = await returnHTML(url);
  const $ = loadByCheerio(html);

  const fetchHTMLText = async (cssSelector) => {
    let returnArray = [];
    const elements = await $(cssSelector);

    if (elements.length === 0) {
      throw new Error(`No elements found for selector: ${cssSelector}\nURL: ${url}`);
    }

    elements.each((i, e) => {
      returnArray.push($(e).text().trim());
    });

    return returnArray;
  };

  const mergeArraysToString = (titleArray, dataArray) => {
    let returnArray = [];
    if (titleArray.length === dataArray.length) {
      for (let i = 0; i < titleArray.length; i++) {
        returnArray.push(titleArray[i] + "：" + dataArray[i]);
      }
      return returnArray;
    } else {
      throw new Error(
        `dataLength don't match at mergeArraysToString.\ntitleArray: ${titleArray} , dataArray.length: ${dataArray}\nURL: ${url}`
      );
    }
  };

  const mergeArraysToDictionary = (keyArray, dataArray) => {
    let returnArray = {};
    if (keyArray.length === dataArray.length) {
      for (let i = 0; i < keyArray.length; i++) {
        returnArray[keyArray[i]] = dataArray[i];
      }
      return returnArray;
    } else {
      throw new Error(
        `dataLength don't match at mergeArrayToDictionary.\nkeyArray: ${keyArray} , dataArray.length: ${dataArray}\nURL: ${url}`
      );
    }
  };

  let returnScrapeArray = {};
  try {
    //NOTE: 名前
    returnScrapeArray.playerName = await fetchHTMLText(cssSelectorArray.playerName);
    //NOTE: 最新試合成績
    const recentStatsHeader = await fetchHTMLText(cssSelectorArray.recentStatsHeader);
    const recentStatsData = await fetchHTMLText(cssSelectorArray.recentStatsData);
    returnScrapeArray.recentStats = mergeArraysToDictionary(recentStatsHeader, recentStatsData);
    returnScrapeArray.recentStats.fullText = mergeArraysToString(recentStatsHeader, recentStatsData);
    //NOTE: 通算成績
    const totalStatsHeader = await fetchHTMLText(cssSelectorArray.totalStatsHeader);
    const totalStatsData = await fetchHTMLText(cssSelectorArray.totalStatsData);
    returnScrapeArray.totalStats = mergeArraysToString(totalStatsHeader, totalStatsData);
    //NOTE: 更新日時（複数ある場合がある。ページ上に表示されるのは[0]だったので[0]を選択）
    const updateDateArray = await fetchHTMLText(".bb-tableNote__update");
    returnScrapeArray.updateDate = updateDateArray[0];
  } catch (error) {
    throw new Error(
      `${error}
      \nCurrent returnArray:
      \nplayerName: ${returnScrapeArray.playerName}
      \nrecentStats: ${returnScrapeArray.recentStats}
      \ntotalStats: ${returnScrapeArray.totalStats}
      \nupdateDate: ${returnScrapeArray.updateDate}`
    );
  }

  return returnScrapeArray;
};

export { scrapeToArray };
