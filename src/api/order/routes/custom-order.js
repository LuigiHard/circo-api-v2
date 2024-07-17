const getRawBody = require('raw-body');

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders/webhook',
      handler: 'order.webhook',
      config: {
        middlewares: [
          async (ctx, next) => {
            ctx.request.body = await getRawBody(ctx.req, {
              length: ctx.req.headers['content-length'],
              limit: '1mb',
              encoding: 'utf8',
            });
            await next();
          },
        ],
      },
    },
  ],
};
