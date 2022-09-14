import fp from 'fastify-plugin';
import { FastifyInstance, FastifyServerOptions } from 'fastify';
import mongoPl from '@fastify/mongodb';

async function mongo(fastify: FastifyInstance, opts: FastifyServerOptions) {
  fastify.register(mongoPl, {
    forceClose: true,
    url: 'mongodb://mongo:27017'
  });
}
export default fp(mongo, {
  name: 'mongo'
});
