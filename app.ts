import {
  defaultConfig,
  loggerConfig,
  pluginConfig
} from './libs/templates/default';
import { IEasyApiConstructor, ILogger, IPlugin } from './libs/types/config';
import Fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';
import { Events } from './libs/events/events';

class EasyApi {
  private _logger: any;
  public readonly plugins = pluginConfig;
  public readonly config = defaultConfig;
  private _pluginsConfig: Array<IPlugin> = [
    { name: 'Sensible' },
    { name: 'UnderPressure', opts: this.config['underPressure'] },
    { name: 'Cors', opts: this.config['cors'] },
    { name: 'Swagger', opts: this.config['swagger'] }
  ];
  private _port: number = 3001;
  private _debug: boolean = true;
  private readonly _isInContainer: boolean = false;
  private readonly app: FastifyInstance = Fastify();
  private _events: Events = new Events(this);

  constructor(config: IEasyApiConstructor) {
    const env: ILogger = loggerConfig[config.env];
    this._port = config.port ? config.port : this.port;
    this._isInContainer = !!config.isInContainer;
    this._logger = pino(env);
    this.app = Fastify({ logger: env });
    this.registerChoices(config);
  }

  /**
   * It takes the config object passed to the constructor and checks if the auth property is set. If it is, it pushes a new
   * object to the defaultPluginsConfig array
   * @param {IEasyApiConstructor} config - IEasyApiConstructor
   */
  private registerChoices(config: IEasyApiConstructor) {
    if (config.defaultPlugin) {
      this.registerFastifyPlugin();
    }
  }

  /**
   * We're looping through the default plugins config and registering each plugin with the server
   */
  public registerFastifyPlugin(plugin?: IPlugin) {
    if (plugin) {
      this.registerCustomPlugin(plugin);
    } else {
      this._pluginsConfig.map((plugin: IPlugin) => {
        this.app
          .register(this.plugins[plugin.name], plugin.opts ? plugin.opts : {})
          .after(() => {
            if (typeof plugin?.after === 'function') {
              plugin.after();
            }
          });
      });
    }
  }

  private registerCustomPlugin(customPlugin: IPlugin) {
    try {
      let plugin = customPlugin.plugin;
      if (this.plugins[customPlugin.name]) {
        plugin = this.plugins[customPlugin.name];
      }
      this.app.register(plugin, customPlugin.opts ? customPlugin.opts : {});
      this._pluginsConfig.push(customPlugin);
    } catch (e) {
      this.logger.error(e);
    }
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

  get pluginsConfig(): Array<IPlugin> {
    return this._pluginsConfig;
  }
}

export default EasyApi;
