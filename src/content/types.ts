// uuid timestamp amount description sender currency source_type
export interface FetchTransactionsResult {
  uuid: string;
  timestamp: string;
  amount: number;
  description: string;
  sender: string;
  currency: string;
  source_type: string;
}

export type FetchTransactionsFunction = (
  dateFrom: Date,
  dateTo: Date,
  limit?: number,
) => Promise<FetchTransactionsResult[]>;
