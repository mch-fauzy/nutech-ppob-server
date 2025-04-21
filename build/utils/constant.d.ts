declare const CONSTANT: {
    readonly JWT: {
        readonly EXPIRATION_TIME: number;
    };
    readonly LOCAL: {
        readonly EMAIL: "email";
        readonly IAT: "iat";
        readonly EXP: "exp";
    };
    readonly QUERY: {
        readonly DEFAULT_PAGE: 1;
        readonly DEFAULT_PAGE_SIZE: 10;
        readonly DEFAULT_ORDER: "desc";
    };
    readonly INTERNAL_STATUS_CODE: {
        readonly SUCCESS: 0;
        readonly CONFLICT: 1;
        readonly NOT_FOUND: 101;
        readonly BAD_REQUEST: 102;
        readonly INVALID_CREDENTIALS: 103;
        readonly UNAUTHORIZED: 108;
        readonly SERVER_ERROR: 109;
    };
    readonly MULTER: {
        readonly IMAGE_SIZE_LIMIT: number;
        readonly IMAGE_FIELD_NAME: "image";
        readonly ALLOWED_IMAGE_FORMATS: string[];
    };
    readonly REGEX: {
        readonly NOT_ALPHANUMERIC: RegExp;
        readonly NEW_LINE: RegExp;
    };
    readonly ERROR_MESSAGE: {
        readonly UNKNOWN: "Unknown error occurs while processing the request";
        readonly UNRECOGNIZED: "Unrecognized error occurs while processing the request";
    };
    readonly DB_FIELD: {
        readonly ID: "id";
        readonly BANNER_NAME: "banner_name";
        readonly BANNER_IMAGE: "banner_image";
        readonly DESCRIPTION: "description";
        readonly SERVICE_CODE: "service_code";
        readonly SERVICE_NAME: "service_name";
        readonly SERVICE_ICON: "service_icon";
        readonly SERVICE_TARIFF: "service_tariff";
        readonly USER_ID: "user_id";
        readonly SERVICE_ID: "service_id";
        readonly TRANSACTION_TYPE: "transaction_type";
        readonly TOTAL_AMOUNT: "total_amount";
        readonly INVOICE_NUMBER: "invoice_number";
        readonly EMAIL: "email";
        readonly PASSWORD: "password";
        readonly FIRST_NAME: "first_name";
        readonly LAST_NAME: "last_name";
        readonly PROFILE_IMAGE: "profile_image";
        readonly BALANCE: "balance";
        readonly CREATED_AT: "created_at";
        readonly CREATED_BY: "created_by";
        readonly UPDATED_AT: "updated_at";
        readonly UPDATED_BY: "updated_by";
        readonly DELETED_AT: "deleted_at";
        readonly DELETED_BY: "deleted_by";
    };
};
export { CONSTANT };
