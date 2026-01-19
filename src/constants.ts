export const MAKE_TRANSACTIONS_REQUEST = "MAKE_TRANSACTIONS_REQUEST";
export const START_DOWNLOAD_FILE = "START_DOWNLOAD_FILE";

export const DATE_FORMAT_INPUT = "yyyy-MM-dd";

export const DATE_ERROR_TEXT = "Даты должны быть заполнены и дата начала должна быть меньше даты окончания";

export const REPSONAL_BOG_TRANSACTIONS_URL =
  "https://ibank.bog.ge/rest/operations?accountKeys=&amountLowerBound=null&amountUpperBound=null&blocked=N&cardIds=&includeFields=clientKey,prodGroup,docKey,entryId,essId,operationTitle,nominationOriginal,beneficiary,docNomination,nomination,merchantId,essServiceId,groupImageId,postDate,authDate,operationDate,bonusPoint,status,canCopy,amount,ccy,merchantName,entryGroupNameId,sourceEntryGroup,bonusInfo,cashbackAmount,productName,prodGroup,entryType,printSwift,isInternalOperation,transferBankBic,printFormType,sourceEntryGroup,merchantNameInt,counterPartyClient,hasTransferBack,cardLastDigits,accountKey,pfmId,pfmCatId,pfmCatName,pfmParentCatId,pfmParentCatName,bonusType,bonusRate,cashback&income=Y&limit={limit}&nomination=&operationDateTimeLowerBound={dateFrom}&operationDateTimeUpperBound={dateTo}&outcome=N&pfmCatIds=&sortFields=operationDate,docKey&order=";

export const BACKEND_URL = "http://localhost:3101/";
