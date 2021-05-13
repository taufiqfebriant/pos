import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import redis from "redis";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

let RedisStore = connectRedis(session);
let redisClient = redis.createClient();
const prisma = new PrismaClient({
  log: ["query"],
});

const startApolloServer = async () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  );

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
      name: process.env.SESSION_NAME,
      cookie: {
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_MAX_AGE),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res, prisma }),
  });
  await server.start();

  server.applyMiddleware({ app, cors: false });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
};

startApolloServer().catch(err => console.log(err));
