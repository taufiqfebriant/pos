import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup.string().required("Masukkan nama"),
  price: yup
    .number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required("Masukkan harga")
    .integer("Harga harus berupa bilangan bulat")
    .min(1, "Minimum harga adalah 1"),
});
