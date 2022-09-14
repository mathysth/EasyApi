import EasyApi from '../app';
import { FastifyPluginCallback } from 'fastify';

const api: EasyApi = new EasyApi({ env: 'development' });
const server = api.getServer();

const app: FastifyPluginCallback = (server, options, done) => {
  api.logger.info('Route loaded');

  server.get('/ping', (req, res) => {
    res.send('pong').status(200);
  });
  done();
};

server.register(app);
//api.register();
api.start().then(r => {
  api.logger.info('api started');
});
