import { PrismaSelect } from "@paljs/plugins";

export default {
  Mutation: {
    updateItem: async (_, { id, input }, { prisma }, info) => {
      const existingItem = await prisma.item.findUnique({
        where: { name: input.name },
        select: {
          id: true,
        },
      });

      if (existingItem && existingItem.id !== id) {
        throw new Error("Barang sudah terdaftar");
      }

      try {
        const select = new PrismaSelect(info).value;
        const item = await prisma.item.update({
          data: input,
          where: { id },
          ...select,
        });

        return item;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
