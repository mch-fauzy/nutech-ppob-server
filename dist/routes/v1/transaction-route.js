"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouterV1 = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth-middleware");
const transaction_controller_1 = require("../../controllers/transaction-controller");
const transactionRouterV1 = (0, express_1.Router)();
exports.transactionRouterV1 = transactionRouterV1;
transactionRouterV1.get('/balance', auth_middleware_1.authenticateToken, transaction_controller_1.TransactionController.getBalanceForCurrentUser);
