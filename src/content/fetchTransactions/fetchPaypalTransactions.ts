import type { FetchTransactionsFunction, FetchTransactionsResult } from "../types";
// import { format, getTime } from "date-fns";

export const PAYPAL_TRANSACTIONS_URL =
  "https://www.tbank.ru/api/common/v1/operations?appName=supreme&appVersion=0.0.1&origin=web%2Cib5%2Cplatform&sessionid={sessionId}&start={start}&end={end}"; // start 1769457600000 end 1772210482704

export const fetchPaypalTransactions: FetchTransactionsFunction = async (
  dateFrom: Date,
  dateTo: Date,
  limit = 1000,
): Promise<FetchTransactionsResult[]> => {

  return [];
};
