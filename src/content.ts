import { parse, set } from "date-fns";
import { DATE_FORMAT_INPUT, MAKE_TRANSACTIONS_REQUEST } from "./constants";
import "./style.css";

console.log("STEST: ", "working");

const url =
  "https://ibank.bog.ge/rest/operations?accountKeys=&amountLowerBound=null&amountUpperBound=null&blocked=N&cardIds=&includeFields=clientKey,prodGroup,docKey,entryId,essId,operationTitle,nominationOriginal,beneficiary,docNomination,nomination,merchantId,essServiceId,groupImageId,postDate,authDate,operationDate,bonusPoint,status,canCopy,amount,ccy,merchantName,entryGroupNameId,sourceEntryGroup,bonusInfo,cashbackAmount,productName,prodGroup,entryType,printSwift,isInternalOperation,transferBankBic,printFormType,sourceEntryGroup,merchantNameInt,counterPartyClient,hasTransferBack,cardLastDigits,accountKey,pfmId,pfmCatId,pfmCatName,pfmParentCatId,pfmParentCatName,bonusType,bonusRate,cashback&income=Y&limit={limit}&nomination=&operationDateTimeLowerBound={dateFrom}&operationDateTimeUpperBound={dateTo}&outcome=N&pfmCatIds=&sortFields=operationDate,docKey&order=";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === MAKE_TRANSACTIONS_REQUEST) {
    console.log(message.payload);
    const parsedFromDate = parse(message.payload.fromDate, DATE_FORMAT_INPUT, new Date());
    const parsedToDate = parse(message.payload.toDate, DATE_FORMAT_INPUT, new Date());
    const toDateTime = set(parsedToDate, {
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 0,
    });

    fetchOperations(parsedFromDate, toDateTime).then((res) => {
      console.log("STEST: ", "Fetch res", res);
    });
  }
});

async function fetchOperations(dateFrom: Date, dateTo: Date, limit = 100) {
  console.log("STEST: ", "Fetching transactions from", dateFrom.toISOString(), "to", dateTo.toISOString());
  const resUrl = url
    .replace("{dateFrom}", dateFrom.toISOString())
    .replace("{dateTo}", dateTo.toISOString())
    .replace("{limit}", limit.toString());
  try {
    return await fetch(resUrl, {
      method: "GET",
    }).then((response) => response.json());
  } catch (error) {
    console.error("STEST: ", "Error fetching operations:", error);
  }
}
