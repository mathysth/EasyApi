export interface IEasyApiConfig {}

export interface IPlugin {
  name: string;
  origin?: string;
  opts?: Object;
  folder?: string;
  after?: PluginAfterInterface;
}

export interface IPluginAfter {
  // Change to fastify plugin type
  plugin?: Function;
}

export interface ILogger {
  transport?: ILoggerTransport;
}

interface ILoggerTransport {
  target: string;
  options?: ILoggerTransportOptions;
}

interface ILoggerTransportOptions {
  translateTime?: string;
  ignore?: string;
  colorize?: boolean;
}

export interface IEasyApiConstructor {
  env: string;
  port?: number;
  isInContainer?: boolean;
}
