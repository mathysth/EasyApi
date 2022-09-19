import EasyApi from '../app';
import { FastifyPluginCallback } from 'fastify';

const api: EasyApi = new EasyApi({
  env: 'development',
  auth: { secret: 'bonjour', opts: { maxAge: '3 days' } }
});
const server = api.getServer();

// Creating custom event
// If added before: api.events.loadEvents() the event will automatically be injected
// Else you should call addListener() function from api.events
api.events.addEvent({
  name: 'hello',
  log: false,
  cb: () => {
    api.logger.info('Hello world');
  }
});

// Custom route using Fastify
const app: FastifyPluginCallback = (server, options, done) => {
  api.logger.info('Route loaded');

  server.get('/ping', (req, res) => {
    res.send('pong').status(200);
  });
  done();
};

// Register route using fastify register
server.register(app);
// Register default fastify plugin from api
api.register();

//Start api
api.start().then(r => {
  api.logger.info('api started');
  // Load events
  api.events.loadEvents();
  // Call event from api
  api.events.eventEmitter.emit('start');
  api.events.eventEmitter.emit('defaultPluginRegistered');
  api.events.eventEmitter.emit('hello');
  // Add event after original event were loaded
  api.events.addListener({
    name: 'afterLoad',
    log: false,
    cb: (data: any) => {
      api.logger.info('Event after loadEvent');
      api.logger.info(data);
    }
  });
  // Call event from api
  api.events.eventEmitter.emit('afterLoad', { data: 'object to transfer' });
});
