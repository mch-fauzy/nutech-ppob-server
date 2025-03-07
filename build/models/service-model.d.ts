declare const serviceDbField: {
    readonly id: "id";
    readonly serviceCode: "service_code";
    readonly serviceName: "service_name";
    readonly serviceIcon: "service_icon";
    readonly serviceTariff: "service_tariff";
    readonly createdAt: "created_at";
    readonly createdBy: "created_by";
    readonly updatedAt: "updated_at";
    readonly updatedBy: "updated_by";
    readonly deletedAt: "deleted_at";
    readonly deletedBy: "deleted_by";
};
declare enum ServiceCode {
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
interface ServiceDb {
    id: number;
    service_code: ServiceCode;
    service_name: string;
    service_icon: string;
    service_tariff: number;
    created_at: Date;
    created_by: string | null;
    updated_at: Date;
    updated_by: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
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
export { serviceDbField, ServiceCode, ServiceDb, Service };
