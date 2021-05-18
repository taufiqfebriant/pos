import { shield, allow, rule, not } from "graphql-shield";

const isAuthenticated = rule()((_, {}, { request }) => {
  return request.session.get("userId") !== undefined;
});

export const permissions = shield({
  Query: {
    "*": isAuthenticated,
    viewer: allow,
  },
  Mutation: {
    "*": isAuthenticated,
    login: not(isAuthenticated),
  },
});
