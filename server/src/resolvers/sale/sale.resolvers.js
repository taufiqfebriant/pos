import { PrismaSelect } from "@paljs/plugins";

export default {
  Query: {
    sale: async (_, { where }, { prisma }, info) => {
      try {
        const select = new PrismaSelect(info).value;
        const sale = await prisma.sale.findUnique({
          where,
          ...select,
        });

        const saleDetail =
          await prisma.$queryRaw`SELECT SUM(amount * unit_price) as total FROM sale_details WHERE sale_id = ${where.id} GROUP BY sale_id`;

        if (saleDetail.length) {
          Object.assign(sale, { total: saleDetail[0].total });
        }

        if (sale) {
          sale.saleDetails = sale.saleDetails.map(saleDetail => ({
            ...saleDetail,
            total: saleDetail.amount * saleDetail.unitPrice,
          }));
        }

        return sale;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
