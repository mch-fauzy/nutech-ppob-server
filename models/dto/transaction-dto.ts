import Joi from "joi";

interface TransactionGetBalanceByEmailRequest {
    email: string;
}

class TransactionValidator {
    private static getBalanceByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
    });

    static validateGetBalanceByEmailRequest = async (req: TransactionGetBalanceByEmailRequest): Promise<TransactionGetBalanceByEmailRequest> => {
        return await this.getBalanceByEmailRequestValidator.validateAsync(req);
    };
}

export {
    TransactionGetBalanceByEmailRequest,
    TransactionValidator
};
