import EasyApi from '../app';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import recaptchaPl from 'fastify-recaptcha';
import PATH from 'path';

const dirname = PATH.dirname(__filename);
const api: EasyApi = new EasyApi({
  env: 'development',
  auth: { secret: 'bonjour', opts: { maxAge: '3 days' } },
  // Register default fastify plugin from api
  // If false you can use api.register() to register them
  defaultPlugin: true
});
const server: FastifyInstance = api.getServer();

// Creating custom event
// If added before: api.events.loadEvents() the event will automatically be injected
// Else you should call addListener() function from api.events
api.events.addEvent({
  name: 'hello',
  cb: () => {
    api.logger.info('Hello world');
  }
});

//Register custom plugin
const recaptchaPlugin = {
  name: 'fastifyRecaptcha',
  plugin: recaptchaPl,
  opts: {}
};
api.register(recaptchaPlugin);

// loading routes from file in routes folder
const routes = {
  // Loading fastify autoload
  name: 'Autoload',
  opts: {
    dir: `${dirname}/routes`,
    options: {
      //prefix: "v1"
    }
  }
};
api.register(routes);

//You can also load plugin with autoload plugin
const plugins = {
  // Loading fastify autoload
  name: 'Autoload',
  opts: {
    dir: `${dirname}/plugins`,
    options: {
      //prefix: "v1"
    }
  }
};
api.register(plugins);

//Start api
api.start().then(r => {
  // Load events
  api.events.loadEvents();
  // Call event from api
  api.events.eventEmitter.emit('start');
  api.events.eventEmitter.emit('defaultPluginRegistered');
  api.events.eventEmitter.emit('hello');

  // Add event after original event were loaded
  api.events.addListener({
    name: 'afterLoad',
    cb: (data: any) => {
      api.logger.info('Event after loadEvent');
      api.logger.info(data);
    }
  });
  // Call event from api
  api.events.eventEmitter.emit('afterLoad', { data: 'object to transfer' });

  //Remove event
  api.events.off('afterLoad');
});
