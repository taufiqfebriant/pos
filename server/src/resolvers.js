import { PrismaDelete, PrismaSelect } from "@paljs/plugins";
import { compare } from "bcrypt";
import graphqlFields from "graphql-fields";

export const resolvers = {
  Node: {
    __resolveType: obj => {
      return obj.__typename;
    },
  },
  Mutation: {
    createSale: async (_, { input }, { prisma }, info) => {
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
    },
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
    login: async (_, { input: { username, password } }, { prisma, req }) => {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, password: true },
      });
      if (!user) {
        throw new AuthenticationError("Email dan/atau kata sandi Anda salah");
      }

      const matchPassword = await compare(password, user.password);
      if (!matchPassword) {
        throw new AuthenticationError("Email dan/atau kata sandi Anda salah");
      }

      req.session.userId = user.id;
      return true;
    },
    logout: (_, {}, { req, res }) => {
      return new Promise(resolve =>
        req.session.destroy(err => {
          if (err) return resolve(false);

          res.clearCookie(process.env.SESSION_NAME);
          resolve(true);
        })
      );
    },
    createItem: async (_, { input }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      const item = await prisma.item.create({
        data: input,
        ...select,
      });

      return item;
    },
    deleteItem: async (_, { id }, { prisma }) => {
      try {
        const prismaDelete = new PrismaDelete(prisma);
        await prismaDelete.onDelete({ model: "Item", where: { id } });

        await prisma.item.delete({
          where: { id },
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    updateItem: async (_, { id, input }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      const item = await prisma.item.update({
        data: input,
        where: { id },
        ...select,
      });

      return item;
    },
  },
  Query: {
    item: async (_, { where }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      return await prisma.item.findUnique({
        where,
        ...select,
      });
    },
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
    sale: async (_, { where }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      return await prisma.sale.findUnique({
        where,
        ...select,
      });
    },
    sales: async (_, { filter }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      return await prisma.sale.findMany({
        ...filter,
        ...select,
      });
    },
    viewer: async (_, {}, { prisma, req }, info) => {
      if (!req.session.userId) return null;

      const select = new PrismaSelect(info).value;
      return await prisma.user.findUnique({
        where: { id: req.session.userId },
        ...select,
      });
    },
  },
};
