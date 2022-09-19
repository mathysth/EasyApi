import {
  defaultConfig,
  loggerConfig,
  pluginConfig
} from './libs/templates/default';
import { IEasyApiConstructor, ILogger, IPlugin } from './libs/types/config';
import Fastify, { FastifyInstance } from 'fastify';
import PATH from 'path';
import pino from 'pino';
import { Events } from './libs/events/events';

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
    { name: 'UnderPressure', opts: defaultConfig['underPressure'] },
    { name: 'Cors', opts: defaultConfig['cors'] },
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
  private readonly _isInContainer: boolean = false;
  private readonly app: FastifyInstance = Fastify();
  private _events: Events = new Events(this);

  // faire un test pour savoir si l'interface crash si tout les champs ne sont pas remplie afin d'assign config a this.config
  constructor(config: IEasyApiConstructor) {
    const env: ILogger = loggerConfig[config.env];
    this._port = config.port ? config.port : this.port;
    this._isInContainer = !!config.isInContainer;
    this._logger = pino(env);
    this.app = Fastify({ logger: env });
  }

  /**
   * We're looping through the default plugins config and registering each plugin with the server
   */
  public register() {
    this.defaultPluginsConfig.map((plugin: IPlugin) => {
      this.app.register(
        pluginConfig[plugin.name],
        plugin.opts ? plugin.opts : {}
      );
    });
    this.events.eventEmitter.emit('defaultPluginRegistered');
  }

  /**
   * The function starts the server by listening on the port specified in the `.env` file
   */
  public async start(): Promise<void> {
    try {
      await this.app.listen({
        port: this._port,
        host: this._isInContainer ? '0.0.0.0' : ''
      });
      this.events.eventEmitter.emit('start');
    } catch (e) {
      this.logger.error(e);
      process.exit();
    }
  }

  /**
   * The stop function closes the app and then exits the process
   */
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

  get events(): Events {
    return this._events;
  }

  get isInContainer(): boolean {
    return this._isInContainer;
  }
}
