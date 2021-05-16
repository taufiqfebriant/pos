import { PrismaSelect } from "@paljs/plugins";

export default {
  Mutation: {
    updateItem: async (_, { id, input }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      const item = await prisma.item.update({
        data: input,
        where: { id },
        ...select,
      });

      return item;
    },
  },
};
