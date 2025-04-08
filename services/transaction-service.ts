import {UserRepository} from '../repositories/user-repository';
import {
  TransactionTopUpBalanceByEmailRequest,
  TransactionGetByEmailRequest,
  TransactionPaymentByEmailRequest,
  TransactionResponse,
  TransactionListResponse,
  TransactionGetListByEmailRequest,
  TransactionListWithPaginationResponse,
} from '../models/dto/transaction-dto';
import {USER_DB_FIELD} from '../models/user-model';
import {Failure} from '../utils/failure';
import {TransactionRepository} from '../repositories/transaction-repository';
import {generateInvoiceNumber} from '../utils/generate-invoice-number';
import {ServiceRepository} from '../repositories/service-repository';
import {serviceDbField} from '../models/service-model';
import {transactionDbField} from '../models/transaction-model';
import {handleError} from '../utils/error-handler';
import {withTransactionRetry} from '../utils/db-transaction';

class TransactionService {
  static topUpBalanceByEmail = async (
    req: TransactionTopUpBalanceByEmailRequest,
  ) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
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
        transactionFn: async tx => {
          const currentUser = await UserRepository.findById({
            id: user.id,
            filter: {
              selectFields: [USER_DB_FIELD.balance],
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
        /* Higher isolation levels offer stronger data consistency but decreased concurrency and performance*/
        isolationLevel: 'Serializable',
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
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
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
          selectFields: [serviceDbField.id, serviceDbField.serviceTariff],
          filterFields: [
            {
              field: serviceDbField.serviceCode,
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
        transactionFn: async tx => {
          const currentUser = await UserRepository.findById({
            id: user.id,
            filter: {
              selectFields: [USER_DB_FIELD.balance],
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
        /* Higher isolation levels offer stronger data consistency but decreased concurrency and performance*/
        isolationLevel: 'Serializable',
      });

      return null;
    } catch (error) {
      throw handleError({
        operationName: 'TransactionService.paymentByEmail',
        error,
      });
    }
  };

  static getBalanceByEmail = async (req: TransactionGetByEmailRequest) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [USER_DB_FIELD.balance],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email not found');
      const user = users[0];

      return user;
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
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
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
            transactionDbField.serviceId,
            transactionDbField.invoiceNumber,
            transactionDbField.transactionType,
            transactionDbField.totalAmount,
            transactionDbField.createdAt,
          ],
          filterFields: [
            {
              field: transactionDbField.userId,
              operator: 'equals',
              value: user.id,
            },
          ],
          sorts: [
            {
              field: transactionDbField.createdAt,
              order: 'desc',
            },
          ],
        });
      if (totalTransactions === BigInt(0))
        throw Failure.notFound('Transaction not found');
      const transaction = transactions[0];

      const [services, totalServices] =
        await ServiceRepository.findManyAndCountByFilter({
          selectFields: [
            serviceDbField.serviceCode,
            serviceDbField.serviceName,
          ],
          filterFields: [
            {
              field: serviceDbField.id,
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
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
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
            transactionDbField.serviceId,
            transactionDbField.invoiceNumber,
            transactionDbField.transactionType,
            transactionDbField.totalAmount,
            transactionDbField.createdAt,
          ],
          filterFields: [
            {
              field: transactionDbField.userId,
              operator: 'equals',
              value: user.id,
            },
          ],
          sorts: [
            {
              field: transactionDbField.createdAt,
              order: 'desc',
            },
          ],
          pagination: {
            page: req.page,
            pageSize: req.pageSize,
          },
        });

      const [services] = await ServiceRepository.findManyAndCountByFilter({
        selectFields: [serviceDbField.id, serviceDbField.serviceName],
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
