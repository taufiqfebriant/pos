import { PrismaSelect } from "@paljs/plugins";

import { isEmptyObject } from "../../helpers";

export default {
  Query: {
    items: async (_, { first, after, orderBy, where }, { prisma }, info) => {
      try {
        let edges = [];
        let endCursor = null;
        const response = {};
        const fields = new PrismaSelect(info).value;

        if (after) {
          after = parseInt(
            Buffer.from(after, "base64").toString("ascii").split(":")[1]
          );
        }

        if (fields.select.hasOwnProperty("edges")) {
          let hasNextPage = false;

          const select = new PrismaSelect(info).valueOf("edges.node", "Item", {
            select: { id: true },
          });

          const items = await prisma.item.findMany({
            skip: after ? 1 : undefined,
            cursor: after ? { id: after } : undefined,
            take: first + 1,
            orderBy,
            where,
            ...select,
          });

          if (items.length) {
            if (items.length > first) {
              hasNextPage = true;
              items.pop();
            }

            edges = items.map(item => ({
              cursor: Buffer.from(
                `ItemConnection:${item.id.toString()}`
              ).toString("base64"),
              node: item,
            }));

            endCursor = edges[edges.length - 1].cursor;
          }

          Object.assign(response, {
            edges,
            pageInfo: {
              endCursor,
              hasNextPage,
            },
          });
        }

        return isEmptyObject(response) ? null : response;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
