import { Prisma } from '@prisma/client';
interface TransactionRetryOptions<T> {
    maxRetries?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
    transactionFn: (tx: Prisma.TransactionClient) => Promise<T>;
}
declare const withTransactionRetry: <T>(params: TransactionRetryOptions<T>) => Promise<T>;
export { withTransactionRetry };
