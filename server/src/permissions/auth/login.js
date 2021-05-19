import { and, inputRule, not } from "graphql-shield";

import { isAuthenticated } from "../globals";

const isValidLoginInput = inputRule()(yup =>
  yup.object({
    input: yup.object({
      username: yup.string().required("Masukkan nama pengguna"),
      password: yup.string().required("Masukkan kata sandi"),
    }),
  })
);

export default {
  Mutation: {
    login: and(not(isAuthenticated), isValidLoginInput),
  },
};
