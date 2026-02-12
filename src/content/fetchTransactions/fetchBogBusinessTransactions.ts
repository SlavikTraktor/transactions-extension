import { format } from "date-fns";
import type { FetchTransactionsFunction, FetchTransactionsResult } from "../types";
import { transliterateGeorgian } from "../../helpers/translitGeorgian";

export const BUSINESS_BOG_TRANSACTIONS_URL = "https://bonline.bog.ge/api";

const generateRequestIdentifier = (lengthFrom = 40, lengthTo = 42) => {
  const length = Math.floor(Math.random() * (lengthFrom - lengthTo + 1)) + lengthFrom;
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join("");
};

const body = ({
  dateFrom,
  dateTo,
  reqId,
  limit,
}: {
  dateFrom: string;
  dateTo: string;
  reqId: string;
  limit: number;
}) => ({
  operationName: "getOperations",
  query:
    "query getOperations($filter: OperationFilterModel, $paging: OperationPagingModel, $includeTotals: Boolean) {\n        operationsView {\n            getOperations(filter: $filter, paging: $paging, includeTotals: $includeTotals) {\n                operations {\n                    amount\n                    ccy\n                    nomination\n                    valueDate\n                    docStatus\n                    senderBenefAcctNo\n                    senderBenefName\n                    operationSource\n                    type\n                    docKey\n                    docType\n                    printUrl\n                    swiftUrl\n                    isOut\n                    permission {\n                        canCancel\n                        canCopy\n                        canReturn\n                        canEdit\n                        canPrint\n                        canPrintSwift\n                        canTrackSwift\n                        canView\n                    }\n                }\n                totals {\n                    amount\n                    ccy\n                    count\n                }\n                isMoreDataAvailable\n                totalCount\n            }\n        }\n    }",
  variables: {
    filter: { dateFrom, dateTo },
    paging: { direction: "DESC", take: limit, requestIdentifier: reqId },
    includeTotals: false,
  },
});

export const fetchBogBusinessTransactions: FetchTransactionsFunction = async (
  dateFrom: Date,
  dateTo: Date,
  limit = 1000,
): Promise<FetchTransactionsResult[]> => {
  return await fetch(BUSINESS_BOG_TRANSACTIONS_URL, {
    method: "POST",
    body: JSON.stringify(
      body({
        reqId: generateRequestIdentifier(),
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        limit,
      }),
    ),
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  })
    .then((response) => response.json())
    .then((res) => {
      return res.data.operationsView.getOperations.operations
        .filter((operation: any) => !operation.isOut)
        .map((operation: any) => ({
          uuid: `${operation.docKey}`,
          timestamp: format(new Date(operation.valueDate), "yyyy-MM-dd 00:00:00"),
          amount: operation.amount,
          description: operation.nomination,
          sender: transliterateGeorgian(operation.senderBenefName),
          currency: operation.ccy,
          source_type: "bog_business",
        }));
    });
};
