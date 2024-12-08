// Read-only property
const bannerDbField = {
    id: 'id',
    bannerName: 'banner_name',
    bannerImage: 'banner_image',
    description: 'description',
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by',
    deletedAt: 'deleted_at',
    deletedBy: 'deleted_by'
} as const;

interface Banner {
    id: number;
    bannerName: string;
    bannerImage: string;
    description: string;
    createdAt: Date;
    createdBy: string | null;
    updatedAt: Date;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
}

export {
    bannerDbField,
    Banner,
};
