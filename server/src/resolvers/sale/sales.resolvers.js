import { PrismaSelect } from "@paljs/plugins";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

import { isEmptyObject } from "../../helpers";

export default {
  Query: {
    sales: async (_, { first, after, orderBy, gte, lt }, { prisma }, info) => {
      try {
        const response = {};
        const fields = new PrismaSelect(info).value;

        if (after) {
          after = parseInt(
            Buffer.from(after, "base64").toString("ascii").split(":")[1]
          );
        }

        if (fields.select.hasOwnProperty("edges")) {
          let hasNextPage = false;

          const select = new PrismaSelect(info).valueOf("edges.node", "Sale", {
            select: { id: true },
          });

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

          let edges = sales.map(sale => ({
            cursor: Buffer.from(
              `SaleConnection:${sale.id.toString()}`
            ).toString("base64"),
            node: sale,
          }));

          if (fields.select.edges.select.node.select.total) {
            const saleIds = sales.map(sale => sale.id);

            if (saleIds.length) {
              const totals =
                await prisma.$queryRaw`SELECT sale_id, SUM(amount * unit_price) as total FROM sale_details WHERE sale_id IN (${Prisma.join(
                  saleIds
                )}) GROUP BY sale_id`;

              if (totals) {
                edges = edges.map(edge => ({
                  cursor: edge.cursor,
                  node: {
                    ...edge.node,
                    total: totals.find(el => el.sale_id === node.id).total,
                  },
                }));
              }
            }
          }

          const endCursor = edges.length
            ? edges[edges.length - 1].cursor
            : null;

          Object.assign(response, {
            edges,
            pageInfo: {
              endCursor,
              hasNextPage,
            },
          });
        }

        if (fields.select.totalCount) {
          const totalCount = await prisma.sale.count({
            where:
              gte || lt
                ? {
                    AND: [
                      {
                        createdAt: {
                          gte: dayjs(gte).toDate(),
                        },
                      },
                      {
                        createdAt: {
                          lt: dayjs(lt).toDate(),
                        },
                      },
                    ],
                  }
                : undefined,
          });

          Object.assign(response, { totalCount: totalCount ?? 0 });
        }

        if (fields.select.totalSum) {
          const getTotalSum =
            await prisma.$queryRaw`SELECT SUM(amount * unit_price) as totalSum FROM sale_details INNER JOIN sales ON sale_details.sale_id = sales.id ${
              gte || lt
                ? Prisma.sql`WHERE ${
                    gte ? Prisma.sql`sales.created_at >= ${gte}` : Prisma.empty
                  } ${gte && lt ? Prisma.sql`AND` : Prisma.empty} ${
                    lt ? Prisma.sql`sales.created_at < ${lt}` : Prisma.empty
                  }`
                : Prisma.empty
            }`;

          Object.assign(response, { totalSum: getTotalSum[0].totalSum ?? 0 });
        }

        if (fields.select.totalItems) {
          const getTotalSum =
            await prisma.$queryRaw`SELECT SUM(amount) as totalItems FROM sale_details INNER JOIN sales ON sale_details.sale_id = sales.id ${
              gte || lt
                ? Prisma.sql`WHERE ${
                    gte ? Prisma.sql`sales.created_at >= ${gte}` : Prisma.empty
                  } ${gte && lt ? Prisma.sql`AND` : Prisma.empty} ${
                    lt ? Prisma.sql`sales.created_at < ${lt}` : Prisma.empty
                  }`
                : Prisma.empty
            }`;

          Object.assign(response, {
            totalItems: getTotalSum[0].totalItems ?? 0,
          });
        }

        return isEmptyObject(response) ? null : response;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
