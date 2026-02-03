import { parse, set } from "date-fns";
import { DATE_FORMAT_INPUT, FETCH_TRANSACTIONS_FROM_WEBSITE, UPLOAD_TRANSACTIONS } from "./constants";
import "./style.css";
import { fetchTransactions } from "./content/fetchTransactions";

console.log("STEST: ", "working");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === FETCH_TRANSACTIONS_FROM_WEBSITE) {
    console.log("STEST:", message.payload);
    const parsedFromDate = parse(message.payload.fromDate, DATE_FORMAT_INPUT, new Date());
    const parsedToDate = parse(message.payload.toDate, DATE_FORMAT_INPUT, new Date());
    const parsedToDateWithTime = set(parsedToDate, {
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 0,
    });

    fetchTransactions(parsedFromDate, parsedToDateWithTime)
      .then((dataToSend) => {
        console.log("STEST: ", "Fetch res", dataToSend);

        chrome.runtime.sendMessage({ type: UPLOAD_TRANSACTIONS, payload: dataToSend }, (response) => {
          console.log("Ответ от бекенда через бэкграунд:", response);
        });
      })
      .catch((err: Error) => {
        console.log("STEST: ", "Fetch res", err.message);
      });
  }
});
