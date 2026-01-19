import { parse, set } from "date-fns";
import {
  BACKEND_URL,
  DATE_FORMAT_INPUT,
  MAKE_TRANSACTIONS_REQUEST,
  REPSONAL_BOG_TRANSACTIONS_URL,
} from "./constants";
import "./style.css";
import axios from "axios";

console.log("STEST: ", "working");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === MAKE_TRANSACTIONS_REQUEST) {
    console.log("STEST:", message.payload);
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
      // uuid timestamp amount description sender currency source_type
      const dataToSend = res.data.map((operation: any) => ({
        uuid: operation.entryId,
        timestamp: operation.operationDate,
        amount: +operation.amount,
        description: operation.nomination,
        sender: "",
        currency: operation.ccy,
        source_type: "bog",
      }));

      axios.post(`${BACKEND_URL}api/transactions`, {
        data: dataToSend,
      }).then((response) => {
        console.log("STEST: ", "Data successfully sent to backend", response.data);
      }).catch((error) => {
        console.error("STEST: ", "Error sending data to backend", error);
      });
    });
  }
});

async function fetchOperations(dateFrom: Date, dateTo: Date, limit = 100) {
  console.log("STEST: ", "Fetching transactions from", dateFrom.toISOString(), "to", dateTo.toISOString());
  const resUrl = REPSONAL_BOG_TRANSACTIONS_URL.replace("{dateFrom}", dateFrom.toISOString())
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

