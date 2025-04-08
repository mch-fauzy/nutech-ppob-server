import {Prisma} from '@prisma/client';

import {prismaClient} from '../configs/prisma-client';
import {Failure} from './failure';

interface TransactionRetryOptions<T> {
  transactionFn: (tx: Prisma.TransactionClient) => Promise<T>;
  maxRetries?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

const withTransactionRetry = async <T>(
  params: TransactionRetryOptions<T>,
): Promise<T> => {
  const {transactionFn, maxRetries = 5, isolationLevel} = params;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await prismaClient.$transaction(transactionFn, {isolationLevel});
    } catch (error) {
      /* If deadlock or have timing issues, then it will continue until max retries */
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        retries++;
        const waitTime = Math.pow(2, retries) * 100;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }

  /* If the loop exhausts all retries, throw this error */
  throw Failure.conflict('Transaction failed due to repeated deadlocks');
};

export {withTransactionRetry};
