import { compare } from "bcrypt";

export default {
  Mutation: {
    login: async (
      _,
      { input: { username, password } },
      { prisma, request }
    ) => {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, password: true },
      });
      if (!user) {
        throw new Error("Email dan/atau kata sandi Anda salah");
      }

      const matchPassword = await compare(password, user.password);
      if (!matchPassword) {
        throw new Error("Email dan/atau kata sandi Anda salah");
      }

      request.session.set("userId", user.id);
      return true;
    },
  },
};
