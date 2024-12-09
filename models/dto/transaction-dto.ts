import Joi from "joi";

import { TransactionType } from "../transaction-model";
import { ServiceCode } from "../service-model";

interface TransactionGetByEmailRequest {
    email: string;
}

interface TransactionGetListByEmailRequest extends TransactionGetByEmailRequest {
    page: number;
    pageSize?: number;
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

interface TransactionResponse {
    invoiceNumber: string;
    serviceCode: string;
    serviceName: string;
    transactionType: string;
    totalAmount: number;
    createdAt: string;
}

interface TransactionListResponse {
    invoiceNumber: string;
    transactionType: string;
    description: string | null;
    totalAmount: number;
    createdAt: string;
}

interface TransactionListWithPaginationResponse {
    page: number
    pageSize: number | null
    records: TransactionListResponse[]
}

class TransactionValidator {
    private static getByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
    });

    static validateGetByEmailRequest = async (req: TransactionGetByEmailRequest): Promise<TransactionGetByEmailRequest> => {
        return await this.getByEmailRequestValidator.validateAsync(req);
    };

    private static getListByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        page: Joi.number().min(1).optional(),
        pageSize: Joi.number().min(1).optional(),
    });

    static validateGetListByEmailRequest = async (req: TransactionGetListByEmailRequest): Promise<TransactionGetListByEmailRequest> => {
        return await this.getListByEmailRequestValidator.validateAsync(req);
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
    TransactionGetByEmailRequest,
    TransactionGetListByEmailRequest,
    TransactionTopUpBalanceByEmailRequest,
    TransactionPaymentByEmailRequest,
    TransactionResponse,
    TransactionListResponse,
    TransactionListWithPaginationResponse,
    TransactionValidator
};
