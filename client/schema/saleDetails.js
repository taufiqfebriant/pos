import * as yup from "yup";

export const schema = yup.object().shape({
  saleDetails: yup.array().of(
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
});
