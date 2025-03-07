import {Router} from 'express';

import {TransactionController} from '../../controllers/transaction-controller';

const transactionRouterV1 = Router();

transactionRouterV1.get(
  '/balance',
  TransactionController.getBalanceForCurrentUser,
);
transactionRouterV1.get(
  '/transaction/history',
  TransactionController.getListForCurrentUser,
);
transactionRouterV1.post(
  '/topup',
  TransactionController.topUpBalanceForCurrentUser,
);
transactionRouterV1.post(
  '/transaction',
  TransactionController.paymentForCurrentUser,
);

export {transactionRouterV1};
