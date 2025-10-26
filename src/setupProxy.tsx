import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function(app: { use: (arg0: string, arg1: any) => void; }) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://linkshortener-backend-b3becfdaevd6akbf.centralus-01.azurewebsites.net',
      changeOrigin: true,
      secure: true,
    //   logLevel: 'debug'
    })
  );
};