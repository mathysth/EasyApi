import FastyifyCors from '@fastify/cors';
import FastifyUnderPressure from '@fastify/under-pressure';
import FastifyAutoload from '@fastify/autoload';
import FastifySensible from '@fastify/sensible';
import FastifyJwt from '@fastify/jwt';
import FastifySwagger from '@fastify/swagger';

export const pluginConfig: { [index: string]: any } = {
  Sensible: FastifySensible,
  UnderPressure: FastifyUnderPressure,
  Cors: FastyifyCors,
  Autoload: FastifyAutoload,
  Jwt: FastifyJwt,
  Swagger: FastifySwagger
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

export const defaultConfig: { [index: string]: any } = {
  db: {
    server: {},
    connexionString: '',
    availableSGBD: ['POSTGRESQL', 'MONGO', 'SQL']
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
  swagger: {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Fastify URL Shortener',
        description: 'Fastify URL Shortener documentation',
        version: '1.0'
      },
      externalDocs: {
        url: 'https://github.com/delvedor/fastify-example',
        description: 'Find more info here'
      },
      host: 'localhost', // and your deployed url
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json', 'text/html'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Bearer',
          in: 'header'
        },
        Csrf: {
          type: 'apiKey',
          name: 'x-csrf-token',
          in: 'header'
        }
      }
    },
    // let's expose the documentation only in development
    // it's up to you decide who should see this page,
    // but it's alwaysx better to start safe.
    exposeRoute: process.env.NODE_ENV !== 'production'
  }
};
