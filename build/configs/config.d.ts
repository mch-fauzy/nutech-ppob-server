declare const CONFIG: {
    SERVER: {
        PORT: string | undefined;
    };
    APP: {
        NAME: string | undefined;
        BASE_URL: string | undefined;
        DOCS: string | undefined;
        JWT_ACCESS_SECRET: string | undefined;
        STATIC_DIRECTORY: string | undefined;
        IMAGE_STATIC_URL: string | undefined;
        IMAGE_STORAGE_DIRECTORY: string | undefined;
    };
    CLOUDINARY: {
        CLOUD_NAME: string | undefined;
        API_KEY: string | undefined;
        API_SECRET: string | undefined;
        IMAGE_STORAGE_DIRECTORY: string | undefined;
    };
};
export { CONFIG };
