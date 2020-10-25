export default {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6397,
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || ''
}
