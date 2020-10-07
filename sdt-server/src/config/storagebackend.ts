export default {
    S3_END_POINT: process.env.S3_END_POINT || 'http://localhost:9000',
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || 'MY_ACCESS_KEY',
    S3_SECRET_KEY: process.env.S3_SECRET_KEY || 'MY_SECRET_KEY',
    S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE || true,
    S3_SIGNATURE_VERSION: process.env.S3_SIGNATURE_VERSION || 'v4',
    S3_DEFAULT_BUCKET: process.env.S3_DEFAULT_BUCKET || 'sdf-dev',
    LOCAL_DIR: process.env.LOCAL_DIR || 'public/upload/sdf-dev',
    LOCAL_END_POINT_URL: process.env.LOCAL_END_POINT || '/upload/sdf-dev/'
}
