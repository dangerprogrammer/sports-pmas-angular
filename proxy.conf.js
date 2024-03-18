const PROXY_CONFIG = [
    {
        context: ['/nest-api'],
        target: 'https://949b-189-57-151-123.ngrok-free.app',
        secure: false,
        logLevel: 'debug',
        pathRewrite: { '^/nest-api': '' }
    }
];

module.exports = PROXY_CONFIG;