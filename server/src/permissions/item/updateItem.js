import { inputRule, and } from "graphql-shield";

import { isAuthenticated } from "../globals";

const isValidUpdateItemInput = inputRule()(yup =>
  yup.object({
    input: yup.object({
      name: yup.string().required("Masukkan nama"),
      price: yup
        .number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required("Masukkan harga")
        .integer("Harga harus berupa bilangan bulat")
        .min(1, "Minimum harga adalah 1"),
    }),
  })
);

export default {
  Mutation: {
    updateItem: and(isAuthenticated, isValidUpdateItemInput),
  },
};
