import { PrismaSelect } from "@paljs/plugins";

export default {
  Mutation: {
    createSale: async (_, { input }, { prisma }, info) => {
      try {
        await Promise.all(
          input.map(async saleDetail => {
            const { price } = await prisma.item.findUnique({
              where: { id: parseInt(saleDetail.itemId) },
            });
            Object.assign(saleDetail, { unitPrice: price });
          })
        );

        const select = new PrismaSelect(info).value;
        const sale = await prisma.sale.create({
          data: {
            saleDetails: {
              createMany: {
                data: input,
              },
            },
          },
          ...select,
        });

        return sale;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
