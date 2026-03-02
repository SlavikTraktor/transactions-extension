import type { FetchTransactionsFunction, FetchTransactionsResult } from "../types";
import { format, getTime } from "date-fns";

export const TINKOFF_TRANSACTIONS_URL =
  "https://www.tbank.ru/api/common/v1/operations?appName=supreme&appVersion=0.0.1&origin=web%2Cib5%2Cplatform&sessionid={sessionId}&start={start}&end={end}"; // start 1769457600000 end 1772210482704

export const fetchTinkoffTransactions: FetchTransactionsFunction = async (
  dateFrom: Date,
  dateTo: Date,
  _ = 1000,
): Promise<FetchTransactionsResult[]> => {
  const sessionId = await getCookieValue("psid");

  if (!sessionId) {
    throw new Error("Session ID not found in cookies");
  }

  console.log("STEST: sessionId", sessionId);

  const resUrl = TINKOFF_TRANSACTIONS_URL.replace("{sessionId}", sessionId)
    .replace("{start}", getTime(dateFrom).toString())
    .replace("{end}", getTime(dateTo).toString());

  return await fetch(resUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) =>
      res.payload
        .filter((op: any) => op.status === "OK" && op.group === "INCOME")
        .map((operation: any) => ({
          uuid: operation.id,
          timestamp: format(new Date(operation.debitingTime.milliseconds), "yyyy-MM-dd HH:mm:ss"),
          amount: operation.amount.value,
          description: operation.description,
          sender: operation.senderDetails || '',
          currency: operation.amount.currency.name,
          source_type: "tinkoff",
        })),
    );
};

async function getCookieValue(name: string) {
  const cookie = await cookieStore.get(name);
  return cookie ? cookie.value : null;
}
