import { defaultConfig } from './libs/templates/default';
import EasyApiConfigSchema from './libs/types/config';
import Fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';
import { EventsSchema } from './libs/types/events';

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
  debug: boolean = true;
  isInContainer: boolean = false;
  app: FastifyInstance = Fastify();
  config: EasyApiConfigSchema = defaultConfig;
  // find a way to dispatch event
  events: Array<EventsSchema> = [];
  test: Object;

  // faire un test pour savoir si l'interface crash si tout les champs ne sont pas remplie afin d'assign config a this.config
  constructor(config: any) {
    this.test = config;
  }

  async register() {}

  async start(): Promise<void> {
    if (this.debug) {
      // give possibilite to give custom logger
      this.app = Fastify({
        logger: {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        }
      });
    }
    await this.app.listen({
      port: this.port,
      host: this.isInContainer ? '0.0.0.0' : undefined
    });
  }

  stop(): void {
    this.app.close().then(
      () => {
        this.logger.info('successfully closed!');
      },
      err => {
        this.logger.error('an error happened', err);
      }
    );
  }

  addEvent(event: EventsSchema): boolean {
    return true;
  }
}
