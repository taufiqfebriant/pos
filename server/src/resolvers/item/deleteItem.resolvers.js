import { PrismaDelete } from "@paljs/plugins";

export default {
  Mutation: {
    deleteItem: async (_, { id }, { prisma }) => {
      try {
        const prismaDelete = new PrismaDelete(prisma);
        await prismaDelete.onDelete({ model: "Item", where: { id } });

        await prisma.item.delete({
          where: { id },
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
