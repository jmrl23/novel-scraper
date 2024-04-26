import fastifyPlugin from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import env from 'env-var';

export default fastifyPlugin(async function swaggerPlugin(app) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Scraper service',
        version: '1.0.0',
      },
      servers: [
        {
          url: env
            .get('SERVER_URL')
            .default('http://localhost:3001')
            .asString(),
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    hideUntagged: true,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
});
