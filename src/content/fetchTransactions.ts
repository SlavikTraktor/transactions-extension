import { fetchBogBusinessTransactions } from "./fetchTransactions/fetchBogBusinessTransactions";
import { fetchBogTransactions } from "./fetchTransactions/fetchBogTransactions";
import type { FetchTransactionsFunction } from "./types";

const transactionsFunctionMap: Record<string, FetchTransactionsFunction> = {
  "ibank.bog.ge": fetchBogTransactions,
  "bonline.bog.ge" : fetchBogBusinessTransactions,
};

export async function fetchTransactions(dateFrom: Date, dateTo: Date, limit = 1000) {
  const hostname = window.location.hostname;

  const fetchFunction = transactionsFunctionMap[hostname];

  if (!fetchFunction) {
    throw new Error("Неправильный домен, здесь нет транзакций для получения");
  }

  console.log("STEST: ", "Fetching transactions from", dateFrom.toISOString(), "to", dateTo.toISOString());

  return fetchFunction(dateFrom, dateTo, limit);
}
