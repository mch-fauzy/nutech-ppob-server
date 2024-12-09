// Read-only property
const serviceDbField = {
    id: 'id',
    serviceCode: 'service_code',
    serviceName: 'service_name',
    serviceIcon: 'service_icon',
    serviceTariff: 'service_tariff',
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by',
    deletedAt: 'deleted_at',
    deletedBy: 'deleted_by'
} as const;

enum ServiceCode {
    PAJAK = "PAJAK",
    PLN = "PLN",
    PDAM = "PDAM",
    PULSA = "PULSA",
    PGN = "PGN",
    MUSIK = "MUSIK",
    TV = "TV",
    PAKET_DATA = "PAKET_DATA",
    VOUCHER_GAME = "VOUCHER_GAME",
    VOUCHER_MAKANAN = "VOUCHER_MAKANAN",
    QURBAN = "QURBAN",
    ZAKAT = "ZAKAT"
}

interface Service {
    id: number;
    serviceCode: ServiceCode;
    serviceName: string;
    serviceIcon: string;
    serviceTariff: number;
    createdAt: Date;
    createdBy: string | null;
    updatedAt: Date;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
}

export {
    serviceDbField,
    ServiceCode,
    Service,
};
