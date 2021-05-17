import { PrismaSelect } from "@paljs/plugins";

export default {
  Query: {
    sale: async (_, { where }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;
      const sale = await prisma.sale.findUnique({
        where,
        ...select,
      });

      const saleDetail =
        await prisma.$queryRaw`SELECT SUM(amount * unit_price) as total FROM sale_details WHERE sale_id = ${where.id} GROUP BY sale_id`;
      Object.assign(sale, { total: saleDetail[0].total });

      const getSaleTotal =
        await prisma.$queryRaw`SELECT SUM(amount * unit_price) as total FROM sale_details WHERE sale_id = ${where.id} GROUP BY sale_id`;
      sale.total = getSaleTotal[0].total;

      sale.saleDetails = sale.saleDetails.map(saleDetail => ({
        ...saleDetail,
        total: saleDetail.amount * saleDetail.unitPrice,
      }));

      return sale;
    },
  },
};
