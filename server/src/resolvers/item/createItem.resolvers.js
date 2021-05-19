import { PrismaSelect } from "@paljs/plugins";

export default {
  Mutation: {
    createItem: async (_, { input }, { prisma }, info) => {
      const itemExists = await prisma.item.count({
        where: { name: input.name },
      });

      if (itemExists) {
        throw new Error("Barang sudah terdaftar");
      }

      try {
        const select = new PrismaSelect(info).value;
        const item = await prisma.item.create({
          data: input,
          ...select,
        });

        return item;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
