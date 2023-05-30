import { convertToDate } from "./convertToDate.mjs";
const txtDate = "05月30日";
let now = new Date();
now = now.getMonth() + 1 + "月" + now.getDate() + "日";
console.log(now);
if (convertToDate(txtDate) > convertToDate(now)) {
  console.log(`${txtDate} > ${now}`);
} else if (convertToDate(txtDate) < convertToDate(now)) {
  console.log(`${txtDate} < ${now}`);
} else {
  console.log(`${txtDate} === ${now}`);
}
