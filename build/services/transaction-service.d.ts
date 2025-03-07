import { TransactionTopUpBalanceByEmailRequest, TransactionGetByEmailRequest, TransactionPaymentByEmailRequest, TransactionResponse, TransactionGetListByEmailRequest, TransactionListWithPaginationResponse } from '../models/dto/transaction-dto';
declare class TransactionService {
    static topUpBalanceByEmail: (req: TransactionTopUpBalanceByEmailRequest) => Promise<null>;
    static paymentByEmail: (req: TransactionPaymentByEmailRequest) => Promise<null>;
    static getBalanceByEmail: (req: TransactionGetByEmailRequest) => Promise<import("../models/user-model").User>;
    static getLatestByEmail: (req: TransactionGetByEmailRequest) => Promise<TransactionResponse>;
    static getListByEmail: (req: TransactionGetListByEmailRequest) => Promise<TransactionListWithPaginationResponse>;
}
export { TransactionService };
