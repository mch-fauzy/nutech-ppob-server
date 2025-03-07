"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouterV1 = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("../../controllers/transaction-controller");
const transactionRouterV1 = (0, express_1.Router)();
exports.transactionRouterV1 = transactionRouterV1;
transactionRouterV1.get('/balance', transaction_controller_1.TransactionController.getBalanceForCurrentUser);
transactionRouterV1.get('/transaction/history', transaction_controller_1.TransactionController.getListForCurrentUser);
transactionRouterV1.post('/topup', transaction_controller_1.TransactionController.topUpBalanceForCurrentUser);
transactionRouterV1.post('/transaction', transaction_controller_1.TransactionController.paymentForCurrentUser);
//# sourceMappingURL=transaction-route.js.map