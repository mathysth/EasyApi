import { defaultConfig } from './libs/templates/default';
import EasyApiConfigSchema from './libs/types/config';
import { fastify, FastifyInstance } from 'fastify';
import pino from 'pino';

export default class EasyApi {
  logger: any = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });
  // Give possibilite to inject custom plugin in the futur
  availablePlugins = ['Sensible', 'UnderPressure', 'Cors', 'Autoload'];
  defaultPlugins = [
    { name: 'Sensible' },
    { name: 'UnderPressure' },
    { name: 'Cors', origin: '*' },
    {
      name: 'Autoload',
      folder: 'routes',
      after: {
        /** plugins: {} **/
      }
    },
    { name: 'Autoload', folder: 'plugins' }
  ];
  port: number = 3001;
  isInContainer: boolean = false;
  app: FastifyInstance = fastify();
  config: EasyApiConfigSchema = defaultConfig;
  events: Array<string> = [];
  test: Object;

  // faire un test pour savoir si l'interface crash si tout les champs ne sont pas remplie afin d'assign config a this.config
  constructor(config: any) {
    this.test = config;
  }

  async register() {}

  async start() {
    await this.app.listen({
      port: this.port,
      host: this.isInContainer ? '0.0.0.0' : undefined
    });
  }

  stop() {
    this.app.close().then(
      () => {
        this.logger.info('successfully closed!');
      },
      err => {
        this.logger.error('an error happened', err);
      }
    );
  }

  setTests() {}

  runTests() {}
}
