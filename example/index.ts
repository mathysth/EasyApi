import EasyApi from '../app';
import { FastifyPluginCallback } from 'fastify';

const api: EasyApi = new EasyApi({});
const server = api.getServer();

const app: FastifyPluginCallback = (server, options, done) => {
  api.logger.info('Route loaded');
  api.logger.info(server);
  api.logger.info(typeof server);

  server.get('/ping', (req, res) => {
    res.send('pong').status(200);
  });
  done();
};

api.register();
server.register(app);
api.start().then(r => {
  api.logger.info('api started');
});
