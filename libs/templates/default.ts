import { IEasyApiConfig } from '../types/config';
import FastyifyCors from '@fastify/cors';
import FastifyUnderPressure from '@fastify/under-pressure';
import FastifyAutoload from '@fastify/autoload';
import FastifySensible from '@fastify/sensible';

export const defaultConfig: IEasyApiConfig = {
  logger: {
    enable: false,
    config: {
      info: 'info',
      prettyPrint:
        process.env.ENVIRONMENT === 'dev'
          ? {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              colorize: true
            }
          : false
    }
  },
  db: {
    server: {},
    connexionString: '',
    availableSGBD: ['POSTGRESQL', 'MONGO', 'SQL']
  },
  routing: {
    //if true return object for every request even if the route doesn't exist
    alternativeRouting: true,
    routes: [
      {
        path: '/ping',
        action: () => {
          return 'pong';
        }
      }
    ]
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
  },
  events: {
    OnStart: () => {},
    OnRequest: () => {},
    OnClose: () => {},
    //Setup a system where log will be log online onClose event or with a cron
    dispatch: () => {},
    getDispatched: () => {},
    // Can be use if wanted will clear a specific event
    clearEvent: (eventId: string) => {
      return eventId;
    }
  }
};

export const pluginConfig: { [index: string]: any } = {
  Sensible: FastifySensible,
  UnderPressure: FastifyUnderPressure,
  Cors: FastyifyCors,
  Autoload: FastifyAutoload
};
