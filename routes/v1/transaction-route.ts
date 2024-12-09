import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth-middleware';
import { TransactionController } from '../../controllers/transaction-controller';

const transactionRouterV1 = Router();

transactionRouterV1.get('/balance', authenticateToken, TransactionController.getBalanceForCurrentUser);
transactionRouterV1.get('/transaction/history', authenticateToken, TransactionController.getListForCurrentUser);
transactionRouterV1.post('/topup', authenticateToken, TransactionController.topUpBalanceForCurrentUser);
transactionRouterV1.post('/transaction', authenticateToken, TransactionController.paymentForCurrentUser);

export { transactionRouterV1 };
