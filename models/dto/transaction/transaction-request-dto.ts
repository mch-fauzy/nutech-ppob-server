import {TransactionType} from '../../transaction-model';
import {ServiceCode} from '../../service-model';

/**
 * Base interface for transaction requests with email
 */
interface TransactionBaseRequest {
  email: string;
}

/**
 * Request interface for getting transaction by email
 */
type TransactionGetByEmailRequest = TransactionBaseRequest;

/**
 * Request interface for getting transaction list by email with pagination
 */
interface TransactionGetListByEmailRequest extends TransactionBaseRequest {
  page: number;
  pageSize?: number;
}

/**
 * Base interface for transaction operations
 */
interface TransactionOperationRequest extends TransactionBaseRequest {
  transactionType: TransactionType;
}

/**
 * Request interface for top-up balance
 */
interface TransactionTopUpBalanceByEmailRequest
  extends TransactionOperationRequest {
  topUpAmount: number;
}

/**
 * Request interface for payment
 */
interface TransactionPaymentByEmailRequest extends TransactionOperationRequest {
  serviceCode: ServiceCode;
}

export {
  TransactionBaseRequest,
  TransactionGetByEmailRequest,
  TransactionGetListByEmailRequest,
  TransactionOperationRequest,
  TransactionTopUpBalanceByEmailRequest,
  TransactionPaymentByEmailRequest,
};
