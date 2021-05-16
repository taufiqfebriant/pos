import { PrismaSelect } from "@paljs/plugins";
import graphqlFields from "graphql-fields";

export default {
  Query: {
    sales: async (_, { first, after, orderBy }, { prisma }, info) => {
      try {
        let hasNextPage = false;
        let edges, endCursor, totals;
        const topLevelFields = Object.keys(graphqlFields(info));

        if (after) {
          after = parseInt(
            Buffer.from(after, "base64").toString("ascii").split(":")[1]
          );
        }

        if (
          topLevelFields.includes("edges") ||
          topLevelFields.includes("pageInfo")
        ) {
          let withSaleTotal = false;
          const select = new PrismaSelect(info).valueOf("edges.node", "Sale", {
            select: { id: true },
          });

          if (select.select.total) {
            delete select.select.total;
            withSaleTotal = true;
          }

          const sales = await prisma.sale.findMany({
            skip: after ? 1 : undefined,
            cursor: after ? { id: after } : undefined,
            take: first + 1,
            orderBy,
            ...select,
          });

          if (sales.length > first) {
            hasNextPage = true;
            sales.pop();
          }

          if (withSaleTotal) {
            const saleIds = sales.map(sale => sale.id);
            totals =
              await prisma.$queryRaw`SELECT sale_id, SUM(amount * unit_price) as total FROM sale_details WHERE sale_id IN (${Prisma.join(
                saleIds
              )}) GROUP BY sale_id`;
          }

          edges = sales.map(sale => ({
            cursor: Buffer.from(
              `SaleConnection:${sale.id.toString()}`
            ).toString("base64"),
            node: {
              ...sale,
              total: totals.find(el => el.sale_id === sale.id).total,
            },
          }));

          endCursor = edges[edges.length - 1].cursor;
        }

        return {
          edges,
          pageInfo: {
            endCursor,
            hasNextPage,
          },
        };
      } catch (err) {
        console.log(err);
      }
    },
  },
};
