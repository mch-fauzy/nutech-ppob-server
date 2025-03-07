declare const bannerDbField: {
    readonly id: "id";
    readonly bannerName: "banner_name";
    readonly bannerImage: "banner_image";
    readonly description: "description";
    readonly createdAt: "created_at";
    readonly createdBy: "created_by";
    readonly updatedAt: "updated_at";
    readonly updatedBy: "updated_by";
    readonly deletedAt: "deleted_at";
    readonly deletedBy: "deleted_by";
};
interface BannerDb {
    id: number;
    banner_name: string;
    banner_image: string;
    description: string;
    created_at: Date;
    created_by: string | null;
    updated_at: Date;
    updated_by: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
}
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
export { bannerDbField, BannerDb, Banner };
