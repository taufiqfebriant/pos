import { PrismaSelect } from "@paljs/plugins";

export default {
  Mutation: {
    updateSale: async (_, { id, input }, { prisma }, info) => {
      await Promise.all(
        input.map(async saleDetail => {
          const { price } = await prisma.item.findUnique({
            where: { id: parseInt(saleDetail.itemId) },
          });
          Object.assign(saleDetail, { unitPrice: price });
        })
      );

      const select = new PrismaSelect(info).value;
      const sale = await prisma.sale.update({
        data: {
          updatedAt: new Date(),
          saleDetails: {
            deleteMany: {},
            create: input,
          },
        },
        where: { id },
        ...select,
      });

      return sale;
    },
  },
};
