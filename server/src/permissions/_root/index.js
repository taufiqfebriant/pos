import { isAuthenticated } from "../globals";

export default {
  Query: {
    "*": isAuthenticated,
  },
  Mutation: {
    "*": isAuthenticated,
  },
};
