import { lastDayOfMonth, lightFormat } from "date-fns";
import * as _ from "lodash";
import { DATE_ERROR_TEXT, DATE_FORMAT_INPUT, FETCH_TRANSACTIONS_FROM_WEBSITE } from "./constants";
import "./style.css";

const fromDateInput = document.querySelector('input[name="from"]') as HTMLInputElement;
const toDateInput = document.querySelector('input[name="to"]') as HTMLInputElement;
const errorDiv = document.getElementById("error") as HTMLElement;


const setLastMonthDatesOnce = _.once(setLastMonthDates);
setLastMonthDatesOnce();

document.getElementById("fetchBtn")?.addEventListener("click", async () => {
  const fromDate = fromDateInput.value;
  const toDate = toDateInput.value;

  if(!fromDate || !toDate || new Date(fromDate) > new Date(toDate)) {
    errorDiv.innerHTML = DATE_ERROR_TEXT;
    return;
  } else {
    errorDiv.innerHTML = "";
  }

  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  if (tab?.id) {
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

function setLastMonthDates() {
  const today = new Date();
  const monthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const monthEndDate = lastDayOfMonth(monthStartDate);
  fromDateInput.value = lightFormat(monthStartDate, DATE_FORMAT_INPUT);
  toDateInput.value = lightFormat(monthEndDate, DATE_FORMAT_INPUT);
}
