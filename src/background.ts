import axios from "axios";
import { BACKEND_URL, START_DOWNLOAD_FILE, UPLOAD_TRANSACTIONS } from "./constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === START_DOWNLOAD_FILE) {
    chrome.downloads.download(
      {
        url: message.payload.url,
        filename: message.payload.filename,
        saveAs: false,
      },
      (downloadId) => {
        sendResponse({ status: "started", id: downloadId });
      },
    );

    return true;
  }

  if (message.type === UPLOAD_TRANSACTIONS) {
    axios
      .post(`${BACKEND_URL}api/transactions`, {
        data: message.payload,
      })
      .then((response) => {
        sendResponse({ result: "Data successfully sent to backend" });
        console.log("STEST: ", "Data successfully sent to backend", response.data);
      })
      .catch((error) => {
        sendResponse({ result: "Error sending data to backend" });
        console.error("STEST: ", "Error sending data to backend", error);
      });
    return true;
  }
});
