import { FastifyInstance, FastifyServerOptions } from 'fastify';

export default async function userService(
  server: FastifyInstance,
  opts: FastifyServerOptions,
  done: any
) {
  server.get('/ping', async (req, res) => {
    res.send('pong').status(200);
  });
  done();
}
