export interface IEasyApiConfig {}

export interface IPlugin {
  name: string;
  origin?: string;
  opts?: Object;
  folder?: string;
  after?: PluginAfterInterface;
}

interface IPluginAfter {
  // Change to fastify plugin type
  plugin?: Function;
}

interface ILogger {
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
