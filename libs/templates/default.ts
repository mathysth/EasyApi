import FastyifyCors from '@fastify/cors';
import FastifyUnderPressure from '@fastify/under-pressure';
import FastifyAutoload from '@fastify/autoload';
import FastifySensible from '@fastify/sensible';

export const defaultConfig: { [index: string]: any } = {
  db: {
    server: {},
    connexionString: '',
    availableSGBD: ['POSTGRESQL', 'MONGO', 'SQL']
  },
  authentication: {
    enable: false,
    secret: ''
  },
  // custom middleware onStart
  middlewares: [],
  customEnv: {
    dotenv: true,
    schema: {}
  },
  underPressure: {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98
  },
  cors: {
    origin: '*'
  }
};

export const pluginConfig: { [index: string]: any } = {
  Sensible: FastifySensible,
  UnderPressure: FastifyUnderPressure,
  Cors: FastyifyCors,
  Autoload: FastifyAutoload
};

export const loggerConfig: { [index: string]: any } = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true
      }
    }
  },
  production: true,
  test: false
};
