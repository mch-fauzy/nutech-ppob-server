import { TransactionGetByEmailRequest, TransactionGetListByEmailRequest, TransactionTopUpBalanceByEmailRequest, TransactionPaymentByEmailRequest } from './transaction-request-dto';
/**
 * Validator for transaction-related requests
 */
declare class TransactionValidator {
    /**
     * Validator schema for get-by-email requests
     */
    private static getByEmailRequestValidator;
    /**
     * Validates a get-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateGetByEmailRequest: (req: TransactionGetByEmailRequest) => Promise<TransactionGetByEmailRequest>;
    /**
     * Validator schema for get-list-by-email requests
     */
    private static getListByEmailRequestValidator;
    /**
     * Validates a get-list-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateGetListByEmailRequest: (req: TransactionGetListByEmailRequest) => Promise<TransactionGetListByEmailRequest>;
    /**
     * Validator schema for top-up-balance-by-email requests
     */
    private static topUpBalanceByEmailRequestValidator;
    /**
     * Validates a top-up-balance-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateTopUpBalanceByEmailRequest: (req: TransactionTopUpBalanceByEmailRequest) => Promise<TransactionTopUpBalanceByEmailRequest>;
    /**
     * Validator schema for payment-by-email requests
     */
    private static paymentByEmailRequestValidator;
    /**
     * Validates a payment-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validatePaymentByEmailRequest: (req: TransactionPaymentByEmailRequest) => Promise<TransactionPaymentByEmailRequest>;
}
export { TransactionValidator };
