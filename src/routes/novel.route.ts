import { type FastifyInstance } from 'fastify';
import NovelService from '../services/novel.service';

export const autoPrefix = '/novel';

export default (async function (instance: FastifyInstance) {
  const novelService = await NovelService.getInstance();

  instance.route({
    method: 'POST',
    url: '/',
    schema: {
      security: [],
      tags: ['novel'],
      body: {
        type: 'object',
        required: ['selector', 'url'],
        properties: {
          selector: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
        },
      },
    },
    async handler(request) {
      const { selector, url } = request.body as {
        selector: string;
        url: string;
      };
      const data = await novelService.getData(url, selector);

      return {
        data,
      };
    },
  });
});
