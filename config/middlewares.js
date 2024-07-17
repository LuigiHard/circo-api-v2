module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false,
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:5173'], // Allow your frontend URL
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      credentials: true,
      maxAge: 31536000,
      keepHeadersOnError: true,
      allowHeaders: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'ngrok-skip-browser-warning', // Add the custom header here
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
