import * as yup from "yup";

export const schema = yup.object().shape({
  username: yup.string().required("Masukkan nama pengguna"),
  password: yup.string().required("Masukkan kata sandi"),
});
