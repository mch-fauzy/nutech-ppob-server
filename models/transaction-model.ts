enum TransactionType {
  TOPUP = 'TOPUP',
  PAYMENT = 'PAYMENT',
}

interface TransactionDb {
  id: number;
  user_id: string;
  service_id: number | null;
  transaction_type: TransactionType;
  total_amount: number;
  invoice_number: string;
  created_at: Date;
  created_by: string | null;
  updated_at: Date;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
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

type TransactionCreate = Pick<
  Transaction,
  | 'userId'
  | 'serviceId'
  | 'transactionType'
  | 'totalAmount'
  | 'invoiceNumber'
  | 'createdBy'
  | 'updatedBy'
  | 'updatedAt'
>;

export {
  TransactionType,
  TransactionDb,
  Transaction,
  TransactionPrimaryId,
  TransactionCreate,
};
