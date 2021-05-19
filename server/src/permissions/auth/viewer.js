import { allow } from "graphql-shield";

export default {
  Query: {
    viewer: allow,
  },
};
