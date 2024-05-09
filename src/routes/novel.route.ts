import { type FastifyInstance } from 'fastify';
import NovelService from '../services/novel.service';
import authorizationPrehandler from '../handlers/authorization.prehandler';

export const autoPrefix = '/novel';

export default (async function (instance: FastifyInstance) {
  const novelService = await NovelService.getInstance();

  instance.route({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['novel'],
      body: {
        type: 'object',
        required: ['selector', 'url'],
        properties: {
          selector: {
            type: 'string',
            default: '.chapter-content',
          },
          url: {
            type: 'string',
            default:
              'https://animedaily.net/mushoku-tensei-novel/volume-1-prologue.html',
          },
        },
      },
    },
    preHandler: [authorizationPrehandler],
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
