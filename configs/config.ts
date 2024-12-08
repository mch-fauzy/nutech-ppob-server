const CONFIG = {
    SERVER: {
        PORT: process.env.SERVER_PORT,
        ENV: process.env.SERVER_ENV,
    },
    APP: {
        URL: process.env.APP_URL,
        DOCS: process.env.APP_DOCS,
        JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
        STATIC: process.env.APP_STATIC,
        IMAGE_STORAGE_PATH: process.env.APP_IMG_STORAGE_PATH,
        IMAGE_STATIC_URL: process.env.APP_IMG_STATIC_URL,
    },
    DB: {
        URL: process.env.DATABASE_URL,
    }
};

export { CONFIG };
