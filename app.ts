import {
  defaultConfig,
  loggerConfig,
  pluginConfig
} from './libs/templates/default';
import { IEasyApiConfig, ILogger, IPlugin } from './libs/types/config';
import Fastify, { FastifyInstance } from 'fastify';
import { IEvents } from './libs/types/events';
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
  private _logger: any;
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
        dir: `${dirname}/plugins`,
        options: Object.assign({})
      }
    }
  ];
  private _port: number = 3001;
  private _debug: boolean = true;
  private isInContainer: boolean = false;
  private app: FastifyInstance = Fastify();
  private config: IEasyApiConfig = defaultConfig;
  // find a way to dispatch event
  private events: Array<IEvents> = [];

  // faire un test pour savoir si l'interface crash si tout les champs ne sont pas remplie afin d'assign config a this.config
  constructor(config: any) {
    //this.logger.info(dirname);
    const env: ILogger = loggerConfig[config.env];
    this._port = config.port ? config.port : this.port;
    this._logger = pino(env);
    //find a way to add pino config
    //this.app = Fastify(env);
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
    try {
      await this.app.listen({
        port: this._port,
        host: this.isInContainer ? '0.0.0.0' : ''
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
        process.exit();
      },
      err => {
        this.logger.error('an error happened', err);
        process.exit();
      }
    );
  }

  public addEvent(event: IEvents): boolean {
    return true;
  }

  public getServer(): FastifyInstance {
    return this.app;
  }

  get port(): number {
    return this._port;
  }

  set port(value: number) {
    this._port = value;
  }

  get debug(): boolean {
    return this._debug;
  }

  set debug(value: boolean) {
    this._debug = value;
  }
  get logger(): any {
    return this._logger;
  }

  set logger(value: any) {
    this._logger = value;
  }
}
