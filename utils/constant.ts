const CONSTANT = {
    JWT: {
        EXPIRATION_TIME: 60 * 60 * 12 // Token expiration time in seconds (12 hours)
    },
    HEADERS: {
        EMAIL: 'x-email',
        IAT: 'x-iat',
        EXP: 'x-exp'
    },
    QUERY: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGE_SIZE: 10,
        DEFAULT_ORDER: 'desc'
    },
    INTERNAL_STATUS_CODES: {
        SUCCESS: 0,
        CONFLICT: 1,
        NOT_FOUND: 101,
        BAD_REQUEST: 102,
        INVALID_CREDENTIALS: 103,
        UNAUTHORIZED: 108,
        SERVER_ERROR: 109
    },
    MULTER: {
        IMAGE_SIZE_LIMIT: 2 * 1024 * 1024, // 2MB file size limit mb = bytes * bytes
        IMAGE_FIELD_NAME: 'image', // Field named 'image' is expected in the request
        ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png'] as string[]
    },
    REGEX: {
        NOT_ALPHANUMERIC: /[^a-zA-Z0-9]/g
    }
} as const;

export { CONSTANT };
