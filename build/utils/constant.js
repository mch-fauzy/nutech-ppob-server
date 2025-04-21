"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANT = void 0;
const CONSTANT = {
    JWT: {
        EXPIRATION_TIME: 60 * 60 * 12, // Token expiration time in seconds (12 hours)
    },
    LOCAL: {
        EMAIL: 'email',
        IAT: 'iat',
        EXP: 'exp',
    },
    QUERY: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGE_SIZE: 10,
        DEFAULT_ORDER: 'desc',
    },
    INTERNAL_STATUS_CODE: {
        SUCCESS: 0,
        CONFLICT: 1,
        NOT_FOUND: 101,
        BAD_REQUEST: 102,
        INVALID_CREDENTIALS: 103,
        UNAUTHORIZED: 108,
        SERVER_ERROR: 109,
    },
    MULTER: {
        IMAGE_SIZE_LIMIT: 2 * 1024 * 1024,
        IMAGE_FIELD_NAME: 'image',
        ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png'],
    },
    REGEX: {
        NOT_ALPHANUMERIC: /[^a-zA-Z0-9]/g,
        NEW_LINE: /[\n]+/g,
    },
    ERROR_MESSAGE: {
        UNKNOWN: 'Unknown error occurs while processing the request',
        UNRECOGNIZED: 'Unrecognized error occurs while processing the request',
    },
    DB_FIELD: {
        ID: 'id',
        BANNER_NAME: 'banner_name',
        BANNER_IMAGE: 'banner_image',
        DESCRIPTION: 'description',
        SERVICE_CODE: 'service_code',
        SERVICE_NAME: 'service_name',
        SERVICE_ICON: 'service_icon',
        SERVICE_TARIFF: 'service_tariff',
        USER_ID: 'user_id',
        SERVICE_ID: 'service_id',
        TRANSACTION_TYPE: 'transaction_type',
        TOTAL_AMOUNT: 'total_amount',
        INVOICE_NUMBER: 'invoice_number',
        EMAIL: 'email',
        PASSWORD: 'password',
        FIRST_NAME: 'first_name',
        LAST_NAME: 'last_name',
        PROFILE_IMAGE: 'profile_image',
        BALANCE: 'balance',
        CREATED_AT: 'created_at',
        CREATED_BY: 'created_by',
        UPDATED_AT: 'updated_at',
        UPDATED_BY: 'updated_by',
        DELETED_AT: 'deleted_at',
        DELETED_BY: 'deleted_by',
    },
};
exports.CONSTANT = CONSTANT;
//# sourceMappingURL=constant.js.map