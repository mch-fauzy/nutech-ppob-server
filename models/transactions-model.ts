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

type TransactionDbField = keyof typeof transactionDbField;


interface Transaction {
    id: number;
    userId: string;
    serviceId: number;
    transactionType: string;
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

// Other fields either auto generated using default (like balance, createdAt) or nullable
type TransactionCreate = Pick<Transaction, 'id' | 'userId' | 'serviceId' | 'transactionType' | 'totalAmount' | 'invoiceNumber' | 'createdBy' | 'updatedBy' | 'updatedAt'>;

// jadi nanti ada request untuk topup dan payment tapi dalam 1 service, transaction type di assign di controller (di request ada email, transaction_type, topupAmount | email, transaction_type, serviceCode (di joi tambahkan list valid serviceCode))

export {
    transactionDbField,
    Transaction,
    TransactionPrimaryId,
    TransactionCreate,
    TransactionDbField
};
