const PROXY_CONFIG = [
    {
        context: ['/nest-api'],
        target: 'http://localhost:3000/',
        secure: false,
        logLevel: 'debug',
        pathRewrite: { '^/nest-api': '' }
    }
];

module.exports = PROXY_CONFIG;