const CONSTANT = {
    JWT: {
        EXPIRY: 60 * 60 * 12
    },
    HEADERS: {
        EMAIL: 'x-email',
        IAT: 'x-iat',
        EXP: 'x-exp'
    },
    QUERY: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGESIZE: 10,
        DEFAULT_ORDER: 'desc'
    },
    SERVER: {
        DEFAULT_PORT: 3000
    },
    STATUS: {
        SUCCESS: 0,
        CONFLICT: 1,
        NOT_FOUND: 101,
        BAD_REQUEST: 102,
        INVALID_CREDENTIALS: 103,
        UNAUTHORIZED: 108,
        INTERNAL_SERVER_ERROR: 109
    }
} as const;

export { CONSTANT };
