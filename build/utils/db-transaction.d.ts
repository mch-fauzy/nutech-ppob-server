import { Prisma } from '@prisma/client';
interface TransactionRetryOptions<T> {
    transactionFn: (tx: Prisma.TransactionClient) => Promise<T>;
    maxRetries?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
}
declare const withTransactionRetry: <T>(params: TransactionRetryOptions<T>) => Promise<T>;
export { withTransactionRetry };
