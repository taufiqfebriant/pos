import { PrismaDelete, PrismaSelect } from "@paljs/plugins";
import { compare } from "bcrypt";

export const resolvers = {
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
    items: async (_, { filter }, { prisma }, info) => {
      const select = new PrismaSelect(info).value;

      return await prisma.item.findMany({
        ...filter,
        ...select,
      });
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
