import { rule } from "graphql-shield";

export const isAuthenticated = rule()((_, {}, { request }) => {
  return request.session.get("userId") !== undefined;
});
