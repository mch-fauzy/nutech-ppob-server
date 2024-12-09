import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth-middleware';
import { TransactionController } from '../../controllers/transaction-controller';

const transactionRouterV1 = Router();

transactionRouterV1.get('/balance', authenticateToken, TransactionController.getBalanceForCurrentUser);
transactionRouterV1.post('/topup', authenticateToken, TransactionController.topUpBalanceForCurrentUser);

export { transactionRouterV1 };