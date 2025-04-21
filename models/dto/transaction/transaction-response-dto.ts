/**
 * Response interface for a single transaction
 */
interface TransactionResponse {
  invoiceNumber: string;
  serviceCode: string;
  serviceName: string;
  transactionType: string;
  totalAmount: number;
  createdAt: string;
}

/**
 * Response interface for a transaction in a list
 */
interface TransactionListResponse {
  invoiceNumber: string;
  transactionType: string;
  description: string | null;
  totalAmount: number;
  createdAt: string;
}

// TODO: CHANGE PAGINATION RESPONSE TO {metadata (contain page, pageSize, etc), data}
/**
 * Response interface for a paginated list of transactions
 */
interface TransactionListWithPaginationResponse {
  page: number;
  pageSize: number | null;
  records: TransactionListResponse[];
}

/**
 * Response interface for a balance check
 */
interface TransactionBalanceResponse {
  balance: number;
}

export {
  TransactionResponse,
  TransactionListResponse,
  TransactionListWithPaginationResponse,
  TransactionBalanceResponse,
};
