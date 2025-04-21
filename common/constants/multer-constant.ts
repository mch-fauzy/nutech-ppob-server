const MULTER = {
  IMAGE_SIZE_LIMIT: 2 * 1024 * 1024, // 2MB file size limit mb = bytes * bytes
  IMAGE_FIELD_NAME: 'image', // Field named 'image' is expected in the request
  ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png'] as string[],
} as const;

export {MULTER};
