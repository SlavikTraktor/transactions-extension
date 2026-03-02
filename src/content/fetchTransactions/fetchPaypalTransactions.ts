import { format } from "date-fns";
import type {
  FetchTransactionsFunction,
  FetchTransactionsResult,
} from "../types";
// import { format, getTime } from "date-fns";

export const PAYPAL_TRANSACTIONS_URL =
  "https://www.paypal.com/myaccount/activities/filter?q={q}"; // start 1769457600000 end 1772210482704

const baseQuery =
  "free_text_search=&start_date={start}&end_date={end}&type=&status=&currency=&filter_id=&issuance_product_name=&asset_names=&asset_symbols=";
// 2025-12-02 to 2026-03-01
export const fetchPaypalTransactions: FetchTransactionsFunction = async (
  dateFrom: Date,
  dateTo: Date,
  _ = 1000,
): Promise<FetchTransactionsResult[]> => {
  const encodedQuery = btoa(
    baseQuery
      .replace("{start}", format(dateFrom, "yyyy-MM-dd"))
      .replace("{end}", format(dateTo, "yyyy-MM-dd")),
  );

  const resUrl = PAYPAL_TRANSACTIONS_URL.replace("{q}", encodedQuery);

  const res = await fetch(resUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => {
      return res.data.data.activity.transactions
        .map((operation: any) => ({
          uuid: `${operation.id}`,
          timestamp: format(
            new Date(operation.date.rawDate.date),
            "yyyy-MM-dd HH:mm:ss",
          ),
          amount: +operation.amountInfo.contents.amountText
            .replace("&minus;", "-")
            .replace(/[^0-9,+-]/g, "")
            .replace(",", "."),
          description:
            operation.descriptionInfo.content.transactionDescriptionText,
          sender: operation.counterpartyInfo.counterpartyName,
          currency: operation.amounts.currencyCode,
          source_type: "paypal",
        }))
        .filter((o: any) => o.amount > 0);
    });
  return res;
};
