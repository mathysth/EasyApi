import { defaultConfig, pluginConfig } from './libs/templates/default';
import { IEasyApiConfig, IPlugin } from './libs/types/config';
import Fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';
import { IEvents } from './libs/types/events';

enum AvailablePluginEnum {
  Sensible,
  UnderPressure,
  Cors,
  Autoload
}

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
  availablePlugins: (string | AvailablePluginEnum)[] = Object.values(
    AvailablePluginEnum
  ).filter(key => typeof key === 'string');
  availablePluginss = pluginConfig;
  defaultPluginsConfig: Array<IPlugin> = [
    { name: 'Sensible' },
    { name: 'UnderPressure' },
    { name: 'Cors', origin: '*' },
    {
      name: 'Autoload',
      opts: {
        dir: './example/routes',
        options: Object.assign({})
      },
      after: {
        /** plugins: {} **/
      }
    },
    {
      name: 'Autoload',
      opts: {
        dir: './example/plugins',
        options: Object.assign({})
      }
    }
  ];
  port: number = 3001;
  debug: boolean = true;
  isInContainer: boolean = false;
  app: FastifyInstance = Fastify();
  config: IEasyApiConfig = defaultConfig;
  // find a way to dispatch event
  events: Array<IEvents> = [];

  // faire un test pour savoir si l'interface crash si tout les champs ne sont pas remplie afin d'assign config a this.config
  constructor(config: any) {
    this.logger.info(this.availablePlugins);
    this.logger.info('pluginConfig');
  }

  async register() {
    this.defaultPluginsConfig.map((plugin: IPlugin) => {
      this.app.register(
        pluginConfig[plugin.name],
        plugin.opts ? plugin.opts : {}
      );
    });
  }

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

  addEvent(event: IEvents): boolean {
    return true;
  }
}
