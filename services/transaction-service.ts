import {UserRepository} from '../repositories/user-repository';
import {
  TransactionTopUpBalanceByEmailRequest,
  TransactionGetByEmailRequest,
  TransactionPaymentByEmailRequest,
  TransactionGetListByEmailRequest,
} from '../models/dto/transaction/transaction-request-dto';
import {
  TransactionResponse,
  TransactionListResponse,
  TransactionBalanceResponse,
  TransactionListWithPaginationResponse,
} from '../models/dto/transaction/transaction-response-dto';
import {DB_FIELD} from '../common/constants/db-field-constant';
import {Failure} from '../common/utils/errors/failure';
import {TransactionRepository} from '../repositories/transaction-repository';
import {generateInvoiceNumber} from '../common/utils/generators/generate-invoice-number';
import {ServiceRepository} from '../repositories/service-repository';
import {handleError} from '../common/utils/errors/error-handler';
import {withTransactionRetry} from '../common/utils/database/db-transaction';

// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class TransactionService {
  static topUpBalanceByEmail = async (
    req: TransactionTopUpBalanceByEmailRequest,
  ) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [DB_FIELD.ID],
          filterFields: [
            {
              field: DB_FIELD.EMAIL,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email not found');
      const user = users[0];

      // Simulate top-up logic, ideally will have confirmation if user already pay for topup
      // Wrap the repository operations in a transaction
      await withTransactionRetry({
        /* Higher isolation levels offer stronger data consistency but decreased concurrency and performance*/
        isolationLevel: 'Serializable',
        transactionFn: async tx => {
          const currentUser = await UserRepository.findById({
            id: user.id,
            filter: {
              selectFields: [DB_FIELD.BALANCE],
            },
            tx,
          });

          await TransactionRepository.create(
            {
              userId: user.id,
              serviceId: null,
              transactionType: req.transactionType,
              totalAmount: req.topUpAmount,
              invoiceNumber: generateInvoiceNumber(),
              createdBy: req.email,
              updatedBy: req.email,
              updatedAt: new Date(),
            },
            tx,
          );

          await UserRepository.updateById({
            id: user.id,
            data: {
              balance: currentUser.balance + req.topUpAmount,
              updatedBy: req.email,
              updatedAt: new Date(),
            },
            tx,
          });
        },
      });

      return null;
    } catch (error) {
      throw handleError({
        operationName: 'TransactionService.topUpBalanceByEmail',
        error,
      });
    }
  };

  static paymentByEmail = async (req: TransactionPaymentByEmailRequest) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [DB_FIELD.ID],
          filterFields: [
            {
              field: DB_FIELD.EMAIL,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email not found');

      const user = users[0];

      const [services, totalServices] =
        await ServiceRepository.findManyAndCountByFilter({
          selectFields: [DB_FIELD.ID, DB_FIELD.SERVICE_TARIFF],
          filterFields: [
            {
              field: DB_FIELD.SERVICE_CODE,
              operator: 'equals',
              value: req.serviceCode,
            },
          ],
        });
      if (totalServices === BigInt(0))
        throw Failure.notFound('Service with this code not found');

      const service = services[0];

      // Simulate payment logic, ideally will have confirmation if user already pay for payment
      // Wrap the repository operations in a transaction
      await withTransactionRetry({
        /* Higher isolation levels offer stronger data consistency but decreased concurrency and performance*/
        isolationLevel: 'Serializable',
        transactionFn: async tx => {
          const currentUser = await UserRepository.findById({
            id: user.id,
            filter: {
              selectFields: [DB_FIELD.BALANCE],
            },
            tx,
          });

          /* Check if balance is undefined OR balance is higher than tariff */
          if (
            !currentUser.balance ||
            currentUser.balance < service.serviceTariff
          )
            throw Failure.badRequest(
              'Insufficient balance to make the payment',
            );

          await TransactionRepository.create(
            {
              userId: user.id,
              serviceId: service.id,
              transactionType: req.transactionType,
              totalAmount: service.serviceTariff,
              invoiceNumber: generateInvoiceNumber(),
              createdBy: req.email,
              updatedBy: req.email,
              updatedAt: new Date(),
            },
            tx,
          );

          await UserRepository.updateById({
            id: user.id,
            data: {
              balance: currentUser.balance - service.serviceTariff,
              updatedBy: req.email,
              updatedAt: new Date(),
            },
            tx,
          });
        },
      });

      return null;
    } catch (error) {
      throw handleError({
        operationName: 'TransactionService.paymentByEmail',
        error,
      });
    }
  };

  static getBalanceByEmail = async (
    req: TransactionGetByEmailRequest,
  ): Promise<TransactionBalanceResponse> => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [DB_FIELD.BALANCE],
          filterFields: [
            {
              field: DB_FIELD.EMAIL,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email not found');
      const user = users[0];

      return {
        balance: user.balance,
      };
    } catch (error) {
      throw handleError({
        operationName: 'TransactionService.getBalanceByEmail',
        error,
      });
    }
  };

  static getLatestByEmail = async (
    req: TransactionGetByEmailRequest,
  ): Promise<TransactionResponse> => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [DB_FIELD.ID],
          filterFields: [
            {
              field: DB_FIELD.EMAIL,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email not found');
      const user = users[0];

      const [transactions, totalTransactions] =
        await TransactionRepository.findManyAndCountByFilter({
          selectFields: [
            DB_FIELD.SERVICE_ID,
            DB_FIELD.INVOICE_NUMBER,
            DB_FIELD.TRANSACTION_TYPE,
            DB_FIELD.TOTAL_AMOUNT,
            DB_FIELD.CREATED_AT,
          ],
          filterFields: [
            {
              field: DB_FIELD.USER_ID,
              operator: 'equals',
              value: user.id,
            },
          ],
          sorts: [
            {
              field: DB_FIELD.CREATED_AT,
              order: 'desc',
            },
          ],
        });
      if (totalTransactions === BigInt(0))
        throw Failure.notFound('Transaction not found');
      const transaction = transactions[0];

      const [services, totalServices] =
        await ServiceRepository.findManyAndCountByFilter({
          selectFields: [DB_FIELD.SERVICE_CODE, DB_FIELD.SERVICE_NAME],
          filterFields: [
            {
              field: DB_FIELD.ID,
              operator: 'equals',
              value: transaction.serviceId,
            },
          ],
        });
      if (totalServices === BigInt(0))
        throw Failure.notFound('Service not found');
      const service = services[0];

      const response: TransactionResponse = {
        invoiceNumber: transaction.invoiceNumber,
        serviceCode: service.serviceCode,
        serviceName: service.serviceName,
        transactionType: transaction.transactionType,
        totalAmount: transaction.totalAmount,
        createdAt: transaction.createdAt.toISOString(),
      };

      return response;
    } catch (error) {
      throw handleError({
        operationName: 'TransactionService.getLatestByEmail',
        error,
      });
    }
  };

  static getListByEmail = async (
    req: TransactionGetListByEmailRequest,
  ): Promise<TransactionListWithPaginationResponse> => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [DB_FIELD.ID],
          filterFields: [
            {
              field: DB_FIELD.EMAIL,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email not found');
      const user = users[0];

      const [transactions, totalTransactions] =
        await TransactionRepository.findManyAndCountByFilter({
          selectFields: [
            DB_FIELD.SERVICE_ID,
            DB_FIELD.INVOICE_NUMBER,
            DB_FIELD.TRANSACTION_TYPE,
            DB_FIELD.TOTAL_AMOUNT,
            DB_FIELD.CREATED_AT,
          ],
          filterFields: [
            {
              field: DB_FIELD.USER_ID,
              operator: 'equals',
              value: user.id,
            },
          ],
          sorts: [
            {
              field: DB_FIELD.CREATED_AT,
              order: 'desc',
            },
          ],
          pagination: {
            page: req.page,
            pageSize: req.pageSize,
          },
        });

      const [services] = await ServiceRepository.findManyAndCountByFilter({
        selectFields: [DB_FIELD.ID, DB_FIELD.SERVICE_NAME],
      });

      const response: TransactionListResponse[] = transactions.map(
        transaction => {
          // Find service by transaction.serviceId
          const service = services.find(
            service => service.id === transaction.serviceId,
          );

          return {
            invoiceNumber: transaction.invoiceNumber,
            transactionType: transaction.transactionType,
            description: service ? service.serviceName : null,
            totalAmount: transaction.totalAmount,
            createdAt: transaction.createdAt.toISOString(),
          };
        },
      );

      return {
        page: req.page,
        pageSize: req.pageSize ? req.pageSize : Number(totalTransactions),
        records: response,
      };
    } catch (error) {
      throw handleError({
        operationName: 'TransactionService.getListByEmail',
        error,
      });
    }
  };
}

export {TransactionService};
