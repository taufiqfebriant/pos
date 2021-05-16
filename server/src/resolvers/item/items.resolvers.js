import { PrismaSelect } from "@paljs/plugins";
import graphqlFields from "graphql-fields";

export default {
  Query: {
    items: async (_, { first, after, orderBy }, { prisma }, info) => {
      let hasNextPage = false;
      let edges, totalCount, endCursor;
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
        const select = new PrismaSelect(info).valueOf("edges.node", "Item", {
          select: { id: true },
        });

        const items = await prisma.item.findMany({
          skip: after ? 1 : undefined,
          cursor: after ? { id: after } : undefined,
          take: first + 1,
          orderBy,
          ...select,
        });

        if (items.length > first) {
          hasNextPage = true;
          items.pop();
        }

        edges = items.map(item => ({
          cursor: Buffer.from(`ItemConnection:${item.id.toString()}`).toString(
            "base64"
          ),
          node: item,
        }));

        endCursor = edges[edges.length - 1].cursor;
      }

      if (topLevelFields.includes("totalCount")) {
        totalCount = await prisma.item.count();
      }

      return {
        edges,
        totalCount,
        pageInfo: {
          endCursor,
          hasNextPage,
        },
      };
    },
  },
};
