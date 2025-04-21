import Joi from 'joi';
import {TransactionType} from '../../transaction-model';
import {ServiceCode} from '../../service-model';
import {
  TransactionGetByEmailRequest,
  TransactionGetListByEmailRequest,
  TransactionTopUpBalanceByEmailRequest,
  TransactionPaymentByEmailRequest,
} from './transaction-request-dto';

/**
 * Validator for transaction-related requests
 */
class TransactionValidator {
  /**
   * Validator schema for get-by-email requests
   */
  private static getByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
  });

  /**
   * Validates a get-by-email request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateGetByEmailRequest = async (
    req: TransactionGetByEmailRequest,
  ): Promise<TransactionGetByEmailRequest> => {
    return await this.getByEmailRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for get-list-by-email requests
   */
  private static getListByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    page: Joi.number().min(1).optional(),
    pageSize: Joi.number().min(1).optional(),
  });

  /**
   * Validates a get-list-by-email request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateGetListByEmailRequest = async (
    req: TransactionGetListByEmailRequest,
  ): Promise<TransactionGetListByEmailRequest> => {
    return await this.getListByEmailRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for top-up-balance-by-email requests
   */
  private static topUpBalanceByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    transactionType: Joi.string()
      .valid(...Object.values(TransactionType))
      .required(),
    topUpAmount: Joi.number().min(0).required(),
  });

  /**
   * Validates a top-up-balance-by-email request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateTopUpBalanceByEmailRequest = async (
    req: TransactionTopUpBalanceByEmailRequest,
  ): Promise<TransactionTopUpBalanceByEmailRequest> => {
    return await this.topUpBalanceByEmailRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for payment-by-email requests
   */
  private static paymentByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    transactionType: Joi.string()
      .valid(...Object.values(TransactionType))
      .required(),
    serviceCode: Joi.string()
      .valid(...Object.values(ServiceCode))
      .required(),
  });

  /**
   * Validates a payment-by-email request
   * @param req The request to validate
   * @returns The validated request
   */
  static validatePaymentByEmailRequest = async (
    req: TransactionPaymentByEmailRequest,
  ): Promise<TransactionPaymentByEmailRequest> => {
    return await this.paymentByEmailRequestValidator.validateAsync(req);
  };
}

export {TransactionValidator};
