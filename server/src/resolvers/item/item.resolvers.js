import { PrismaSelect } from "@paljs/plugins";

export default {
  Query: {
    item: async (_, { where }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      return await prisma.item.findUnique({
        where,
        ...select,
      });
    },
  },
};
