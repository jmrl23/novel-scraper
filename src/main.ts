import './init';
import app from './app';
import env from 'env-var';
import logger from './libs/utils/logger';
import detectPort from 'detect-port';
import setupPlugin from './plugins/setup.plugin';

async function main() {
  await app.register(setupPlugin);

  const port = await detectPort(env.get('PORT').default(3001).asPortNumber());

  app.listen(
    {
      host:
        env.get('NODE_ENV').default('development').asString() === 'production'
          ? '0.0.0.0'
          : 'localhost',
      port,
    },
    function (_error, address) {
      logger.info(address);
    },
  );
}

void main();
