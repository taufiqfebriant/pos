import { PrismaSelect } from "@paljs/plugins";

export default {
  Mutation: {
    createItem: async (_, { input }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      const item = await prisma.item.create({
        data: input,
        ...select,
      });

      return item;
    },
  },
};
