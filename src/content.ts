import { parse, set } from "date-fns";
import { DATE_FORMAT_INPUT, MAKE_TRANSACTIONS_REQUEST, REPSONAL_BOG_TRANSACTIONS_URL, START_DOWNLOAD_FILE } from "./constants";
import "./style.css";

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
      initiateDownload(
        JSON.stringify(res, null, 2),
        `transactions_${message.payload.fromDate}_to_${message.payload.toDate}.json`,
      );
    });
  }
});

async function fetchOperations(dateFrom: Date, dateTo: Date, limit = 100) {
  console.log("STEST: ", "Fetching transactions from", dateFrom.toISOString(), "to", dateTo.toISOString());
  const resUrl = REPSONAL_BOG_TRANSACTIONS_URL
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

function initiateDownload(data: string, name: string) {
  const blob = new Blob([data], { type: "text/plain" });
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64data = reader.result;
    chrome.runtime.sendMessage(
      {
        type: START_DOWNLOAD_FILE,
        payload: {
          url: base64data,
          filename: name,
        },
      },
      (response) => {
        console.log("STEST: ", "Download response:", response);
      },
    );
  };

  reader.readAsDataURL(blob);
}
