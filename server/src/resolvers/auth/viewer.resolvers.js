import { PrismaSelect } from "@paljs/plugins";

export default {
  Query: {
    viewer: async (_, {}, { prisma, request }, info) => {
      const id = request.session.get("userId");
      if (!id) return null;

      const select = new PrismaSelect(info).value;
      return await prisma.user.findUnique({
        where: { id: req.session.userId },
        ...select,
      });
    },
  },
};
