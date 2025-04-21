import { TransactionTopUpBalanceByEmailRequest, TransactionGetByEmailRequest, TransactionPaymentByEmailRequest, TransactionGetListByEmailRequest } from '../models/dto/transaction/transaction-request-dto';
import { TransactionResponse, TransactionBalanceResponse, TransactionListWithPaginationResponse } from '../models/dto/transaction/transaction-response-dto';
declare class TransactionService {
    static topUpBalanceByEmail: (req: TransactionTopUpBalanceByEmailRequest) => Promise<null>;
    static paymentByEmail: (req: TransactionPaymentByEmailRequest) => Promise<null>;
    static getBalanceByEmail: (req: TransactionGetByEmailRequest) => Promise<TransactionBalanceResponse>;
    static getLatestByEmail: (req: TransactionGetByEmailRequest) => Promise<TransactionResponse>;
    static getListByEmail: (req: TransactionGetListByEmailRequest) => Promise<TransactionListWithPaginationResponse>;
}
export { TransactionService };
