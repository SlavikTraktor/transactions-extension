import { START_DOWNLOAD_FILE } from "../constants";

export function initiateDownload(data: string, name: string) {
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
