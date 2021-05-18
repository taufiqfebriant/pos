import { makeExecutableSchema } from "@graphql-tools/schema";
import fastifySession from "@mgcrea/fastify-session";
import RedisStore from "@mgcrea/fastify-session-redis-store";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import { applyMiddleware } from "graphql-middleware";
import Redis from "ioredis";
import mercurius from "mercurius";

import { typeDefs } from "./typeDefs";
import { permissions } from "./permissions";
import { resolvers } from "./resolvers";

const app = Fastify();
const prisma = new PrismaClient();

app.register(fastifyCors, {
  credentials: true,
  origin: process.env.CLIENT_URL,
});

app.register(fastifyCookie);
app.register(fastifySession, {
  store: new RedisStore({
    client: new Redis(),
    ttl: Number(process.env.SESSION_MAX_AGE),
  }),
  secret: process.env.SESSION_SECRET,
  cookieName: process.env.SESSION_NAME,
  saveUninitialized: false,
  cookie: {
    maxAge: Number(process.env.SESSION_MAX_AGE),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

app.register(mercurius, {
  schema: applyMiddleware(
    makeExecutableSchema({ typeDefs, resolvers }),
    permissions
  ),
  graphiql: "playground",
  jit: 1,
  context: request => ({ prisma, request }),
});

app.listen(4000, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server ready at ${address}/graphql`);
});
