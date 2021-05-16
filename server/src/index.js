import Fastify from "fastify";
import mercurius from "mercurius";
import { PrismaClient } from "@prisma/client";
import fastifyCookie from "fastify-cookie";
import fastifySession from "@mgcrea/fastify-session";
import RedisStore from "@mgcrea/fastify-session-redis-store";
import Redis from "ioredis";

import { schema } from "./schema";
import { resolvers } from "./resolvers";

const app = Fastify();
const prisma = new PrismaClient();

app.register(fastifyCookie);
app.register(fastifySession, {
  store: new RedisStore({
    client: new Redis(),
    ttl: process.env.SESSION_MAX_AGE,
  }),
  secret: process.env.SESSION_SECRET,
  cookieName: process.env.SESSION_NAME,
  saveUninitialized: false,
  cookie: {
    maxAge: process.env.SESSION_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: "playground",
  jit: 1,
  context: request => ({ prisma, request }),
});

app.listen(4000, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server ready at ${address}`);
});
