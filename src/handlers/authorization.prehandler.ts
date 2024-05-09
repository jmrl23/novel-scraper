import type { FastifyRequest } from 'fastify';
import env from 'env-var';
import { Unauthorized, InternalServerError } from 'http-errors';

export default async function authorizationPrehandler(request: FastifyRequest) {
  const authorizationKey = env.get('AUTHORIZATION_KEY').asString();
  const [scheme, key] = request.headers.authorization?.split(' ') ?? [];

  if (authorizationKey === void 0) {
    throw InternalServerError('Authorization key is not set');
  }

  if (scheme !== 'Bearer') throw new Unauthorized();

  if (key !== authorizationKey) throw new Unauthorized();
}
