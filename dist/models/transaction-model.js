"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.transactionDbField = void 0;
// Read-only property
const transactionDbField = {
    id: 'id',
    userId: 'user_id',
    serviceId: 'service_id',
    transactionType: 'transaction_type',
    totalAmount: 'total_amount',
    invoiceNumber: 'invoice_number',
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by',
    deletedAt: 'deleted_at',
    deletedBy: 'deleted_by'
};
exports.transactionDbField = transactionDbField;
var TransactionType;
(function (TransactionType) {
    TransactionType["TOPUP"] = "TOPUP";
    TransactionType["PAYMENT"] = "PAYMENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
