import FastyifyCors from '@fastify/cors';
import FastifyUnderPressure from '@fastify/under-pressure';
import FastifyAutoload from '@fastify/autoload';
import FastifySensible from '@fastify/sensible';
import FastifySwagger from '@fastify/swagger';

export const pluginConfig: { [index: string]: any } = {
  Sensible: FastifySensible,
  UnderPressure: FastifyUnderPressure,
  Cors: FastyifyCors,
  Autoload: FastifyAutoload,
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
    routePrefix: '/swagger',
    exposeRoute: process.env.NODE_ENV !== 'production'
  }
};
