const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
   app.use(
      ['/auth', '/games', '/users'],
      createProxyMiddleware({
         target: 'http://localhost:5000',
      })
   );
};
