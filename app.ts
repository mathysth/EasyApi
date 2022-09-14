import { defaultConfig, pluginConfig } from './libs/templates/default';
import { IEasyApiConfig, IPlugin } from './libs/types/config';
import Fastify, { FastifyInstance } from 'fastify';
import { IEvents } from './libs/types/events';
import { fileURLToPath } from 'url';
import PATH from 'path';
import pino from 'pino';

const dirname = PATH.dirname(__filename);

enum AvailablePluginEnum {
  Sensible,
  UnderPressure,
  Cors,
  Autoload
}

export default class EasyApi {
  readonly logger: any = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });
  // Give possibilite to inject custom plugin in the futur
  readonly availablePlugins: (string | AvailablePluginEnum)[] = Object.values(
    AvailablePluginEnum
  ).filter(key => typeof key === 'string');
  readonly defaultPluginsConfig: Array<IPlugin> = [
    { name: 'Sensible' },
    { name: 'UnderPressure' },
    { name: 'Cors', origin: '*' },
    {
      name: 'Autoload',
      opts: {
        // changer la logique
        dir: `${dirname}/example/routes`,
        options: Object.assign({})
      },
      after: {
        /** plugins: {} **/
      }
    },
    {
      name: 'Autoload',
      opts: {
        dir: `${dirname}/../fastify/plugins`,
        options: Object.assign({})
      }
    }
  ];
  private port: number = 3001;
  private debug: boolean = true;
  private isInContainer: boolean = false;
  private app: FastifyInstance = Fastify();
  private config: IEasyApiConfig = defaultConfig;
  // find a way to dispatch event
  private events: Array<IEvents> = [];

  // faire un test pour savoir si l'interface crash si tout les champs ne sont pas remplie afin d'assign config a this.config
  constructor(config: any) {
    //this.logger.info(this.availablePlugins);
  }

  public register() {
    this.defaultPluginsConfig.map((plugin: IPlugin) => {
      this.app.register(
        pluginConfig[plugin.name],
        plugin.opts ? plugin.opts : {}
      );
    });
  }

  public async start(): Promise<void> {
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
    try {
      await this.app.listen({
        port: this.port,
        host: this.isInContainer ? '0.0.0.0' : undefined
      });
    } catch (e) {
      this.logger.error(e);
      process.exit();
    }
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

  public addEvent(event: IEvents): boolean {
    return true;
  }

  public getServer(): FastifyInstance {
    return this.app;
  }
}
