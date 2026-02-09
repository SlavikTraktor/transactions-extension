import type { FetchTransactionsFunction, FetchTransactionsResult } from "../types";

export const REPSONAL_BOG_TRANSACTIONS_URL =
  "https://ibank.bog.ge/rest/operations?accountKeys=&amountLowerBound=null&amountUpperBound=null&blocked=N&cardIds=&includeFields=clientKey,prodGroup,docKey,entryId,essId,operationTitle,nominationOriginal,beneficiary,docNomination,nomination,merchantId,essServiceId,groupImageId,postDate,authDate,operationDate,bonusPoint,status,canCopy,amount,ccy,merchantName,entryGroupNameId,sourceEntryGroup,bonusInfo,cashbackAmount,productName,prodGroup,entryType,printSwift,isInternalOperation,transferBankBic,printFormType,sourceEntryGroup,merchantNameInt,counterPartyClient,hasTransferBack,cardLastDigits,accountKey,pfmId,pfmCatId,pfmCatName,pfmParentCatId,pfmParentCatName,bonusType,bonusRate,cashback&income=Y&limit={limit}&nomination=&operationDateTimeLowerBound={dateFrom}&operationDateTimeUpperBound={dateTo}&outcome=N&pfmCatIds=&sortFields=operationDate,docKey&order=";

export const fetchBogTransactions: FetchTransactionsFunction = async (
  dateFrom: Date,
  dateTo: Date,
  limit = 1000,
): Promise<FetchTransactionsResult[]> => {
  const resUrl = REPSONAL_BOG_TRANSACTIONS_URL.replace("{dateFrom}", dateFrom.toISOString())
    .replace("{dateTo}", dateTo.toISOString())
    .replace("{limit}", limit.toString());
  return await fetch(resUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) =>
      res.data.map((operation: any) => ({
        uuid: operation.entryId,
        timestamp: operation.operationDate,
        amount: +operation.amount * -1,
        description: operation.nomination,
        sender: "",
        currency: operation.ccy,
        source_type: "bog",
      })),
    );
};
