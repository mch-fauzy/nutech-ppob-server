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
} as const;

enum TransactionType {
    TOPUP = "TOPUP",
    PAYMENT = "PAYMENT"
}

interface Transaction {
    id: number;
    userId: string;
    serviceId: number | null;
    transactionType: TransactionType;
    totalAmount: number;
    invoiceNumber: string;
    createdAt: Date;
    createdBy: string | null;
    updatedAt: Date;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
}

type TransactionPrimaryId = Pick<Transaction, 'id'>;

type TransactionCreate = Pick<Transaction, 'userId' | 'serviceId' | 'transactionType' | 'totalAmount' | 'invoiceNumber' | 'createdBy' | 'updatedBy' | 'updatedAt'>;

export {
    transactionDbField,
    TransactionType,
    Transaction,
    TransactionPrimaryId,
    TransactionCreate
};
