import { inputRule, and } from "graphql-shield";

import { isAuthenticated } from "../globals";

const isValidUpdateSaleInput = inputRule()(yup =>
  yup.object({
    input: yup.array().of(
      yup.object().shape({
        itemId: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .required("Pilih barang"),
        amount: yup
          .number()
          .transform(value => (isNaN(value) ? undefined : value))
          .required("Masukkan jumlah")
          .integer("Jumlah harus berupa bilangan bulat")
          .min(1, "Minimum jumlah adalah 1"),
      })
    ),
  })
);

export default {
  Mutation: {
    updateSale: and(isAuthenticated, isValidUpdateSaleInput),
  },
};
