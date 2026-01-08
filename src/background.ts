import { START_DOWNLOAD_FILE } from "./constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === START_DOWNLOAD_FILE) {
    chrome.downloads.download({
      url: message.payload.url,
      filename: message.payload.filename,
      saveAs: false
    }, (downloadId) => {
      sendResponse({ status: 'started', id: downloadId });
    });
    
    return true;
  }
});