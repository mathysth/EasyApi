export interface IPlugin {
  name: string;
  plugin?: any;
  origin?: string;
  opts?: Object;
  folder?: string;
  after?: Function;
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
  auth?: IEasyApiConstructorAuth;
  defaultPlugin?: boolean;
}

interface IEasyApiConstructorAuth {
  secret: string;
  opts?: Object;
}
