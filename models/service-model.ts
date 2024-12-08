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

interface Service {
    id: number;
    serviceCode: string;
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
    Service,
};
