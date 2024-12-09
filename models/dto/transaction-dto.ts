import Joi from "joi";

import { TransactionType } from "../transaction-model";
import { ServiceCode } from "../service-model";

interface TransactionGetBalanceByEmailRequest {
    email: string;
}

interface TransactionBaseRequest {
    email: string;
    transactionType: TransactionType;
}

interface TransactionTopUpBalanceByEmailRequest extends TransactionBaseRequest {
    topUpAmount: number;
}

interface TransactionPaymentByEmailRequest extends TransactionBaseRequest {
    serviceCode: ServiceCode;
}

class TransactionValidator {
    private static getBalanceByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
    });

    static validateGetBalanceByEmailRequest = async (req: TransactionGetBalanceByEmailRequest): Promise<TransactionGetBalanceByEmailRequest> => {
        return await this.getBalanceByEmailRequestValidator.validateAsync(req);
    };

    private static topUpBalanceByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        transactionType: Joi.string().valid(...Object.values(TransactionType)).required(),
        topUpAmount: Joi.number().min(0).required()
    });

    static validateTopUpBalanceByEmailRequest = async (req: TransactionTopUpBalanceByEmailRequest): Promise<TransactionTopUpBalanceByEmailRequest> => {
        return await this.topUpBalanceByEmailRequestValidator.validateAsync(req);
    };

    private static paymentByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        transactionType: Joi.string().valid(...Object.values(TransactionType)).required(),
        serviceCode: Joi.string().valid(...Object.values(ServiceCode)).required()
    });

    static validatePaymentByEmailRequest = async (req: TransactionPaymentByEmailRequest): Promise<TransactionPaymentByEmailRequest> => {
        return await this.paymentByEmailRequestValidator.validateAsync(req);
    };
}

export {
    TransactionGetBalanceByEmailRequest,
    TransactionTopUpBalanceByEmailRequest,
    TransactionPaymentByEmailRequest,
    TransactionValidator
};
