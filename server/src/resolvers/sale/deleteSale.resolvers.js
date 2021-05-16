import { PrismaDelete } from "@paljs/plugins";

export default {
  Mutation: {
    deleteSale: async (_, { id }, { prisma }) => {
      try {
        const prismaDelete = new PrismaDelete(prisma);
        await prismaDelete.onDelete({ model: "Sale", where: { id } });

        await prisma.sale.delete({
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
