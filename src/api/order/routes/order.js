'use strict';

/**
 * order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const customOrderRoutes = require('./custom-order');

module.exports = createCoreRouter('api::order.order', {
  config: {
    find: {},
    findOne: {},
    create: {},
    update: {},
    delete: {},
  },
  routes: [
    // Add default routes
    {
      method: 'GET',
      path: '/',
      handler: 'order.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/:id',
      handler: 'order.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/',
      handler: 'order.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: 'order.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: 'order.delete',
      config: {
        policies: [],
      },
    },
    // Add custom routes
    ...customOrderRoutes.routes,
  ],
});
