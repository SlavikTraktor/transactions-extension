import { lastDayOfMonth, lightFormat } from "date-fns";
import * as _ from "lodash";
import {
  DATE_ERROR_TEXT,
  DATE_FORMAT_INPUT,
  FETCH_TRANSACTIONS_FROM_WEBSITE,
  UPLOAD_TRANSACTIONS_FINISHED,
} from "./constants";
import "./style.css";

const fromDateInput = document.querySelector('input[name="from"]') as HTMLInputElement;
const toDateInput = document.querySelector('input[name="to"]') as HTMLInputElement;
const errorDiv = document.getElementById("error") as HTMLElement;
const fetchButton = document.getElementById("fetchBtn") as HTMLButtonElement;
const successDiv = document.getElementById("success") as HTMLElement;

const svgInner = `<div class="animate-spin"><svg class="-scale-x-100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.655 1.314l1.858 2.686h-6.994l2.152-7 1.849 2.673c1.684-1.049 3.659-1.673 5.79-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.962 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681z"/></svg></div>`;

const setLastMonthDatesOnce = _.once(setLastMonthDates);
setLastMonthDatesOnce();

fetchButton.addEventListener("click", async () => {
  const fromDate = fromDateInput.value;
  const toDate = toDateInput.value;

  successDiv.innerHTML = "";
  if (!fromDate || !toDate || new Date(fromDate) > new Date(toDate)) {
    errorDiv.innerHTML = DATE_ERROR_TEXT;
    return;
  } else {
    errorDiv.innerHTML = "";
  }

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (tab?.id) {
    setLoading();
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: FETCH_TRANSACTIONS_FROM_WEBSITE,
        payload: {
          fromDate,
          toDate,
        },
      },
      (response) => {
        console.log("STEST: Ответ получено:", response?.status);
      },
    );
  }
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === UPLOAD_TRANSACTIONS_FINISHED) {
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
      setNotLoading();
      if (message.payload?.success) {
        successDiv.innerHTML = "Транзакции успешно загружены ";
      } else {
        errorDiv.innerHTML = "Ошибка при загрузки транзакций";
      }
    });
  }
});

function setLoading() {
  fetchButton.disabled = true;
  fetchButton.innerHTML = svgInner;
  fetchButton.classList.remove("hover:bg-blue-600", "cursor-pointer");
}

function setNotLoading() {
  fetchButton.disabled = false;
  fetchButton.innerHTML = "Fetch Transactions";
  fetchButton.classList.add("hover:bg-blue-600", "cursor-pointer");
}

function setLastMonthDates() {
  const today = new Date();
  const monthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const monthEndDate = lastDayOfMonth(monthStartDate);
  fromDateInput.value = lightFormat(monthStartDate, DATE_FORMAT_INPUT);
  toDateInput.value = lightFormat(monthEndDate, DATE_FORMAT_INPUT);
}
