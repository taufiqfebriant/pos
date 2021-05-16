import { PrismaSelect } from "@paljs/plugins";

export default {
  Query: {
    sale: async (_, { where }, { prisma }, info) => {
      let withSaleTotal, withSaleDetailTotal;
      withSaleTotal = withSaleDetailTotal = false;
      const select = new PrismaSelect(info).value;

      if (select.select.total) {
        delete select.select.total;
        withSaleTotal = true;
      }

      if (select.select.saleDetails.select.total) {
        delete select.select.saleDetails.select.total;
        withSaleDetailTotal = true;
      }

      const sale = await prisma.sale.findUnique({
        where,
        ...select,
      });

      if (withSaleTotal) {
        const saleDetail =
          await prisma.$queryRaw`SELECT SUM(amount * unit_price) as total FROM sale_details WHERE sale_id = ${where.id} GROUP BY sale_id`;
        Object.assign(sale, { total: saleDetail[0].total });
      }

      if (withSaleDetailTotal) {
        sale.saleDetails = sale.saleDetails.map(saleDetail => ({
          ...saleDetail,
          total: saleDetail.amount * saleDetail.unitPrice,
        }));
      }

      return sale;
    },
  },
};
