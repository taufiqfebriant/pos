const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");
const faker = require("faker");

const prisma = new PrismaClient();

async function main() {
  const password = await hash("12345678", 10);

  await prisma.user.create({
    data: {
      username: "taufiq",
      password,
      name: "Taufiq",
    },
  });

  for (let i = 0; i < 30; i++) {
    await prisma.item.create({
      data: {
        name: faker.commerce.productName(),
        price: faker.datatype.number(),
      },
      select: {
        id: true,
      },
    });
  }

  for (let j = 0; j < 30; j++) {
    const amount1 = Math.floor(Math.random() * (3 - 1 + 1) + 1);
    const amount2 = Math.floor(Math.random() * (3 - 1 + 1) + 1);
    const itemId1 = Math.floor(Math.random() * (15 - 1 + 1) + 1);
    const itemId2 = Math.floor(Math.random() * (30 - 16 + 1) + 16);

    const { price: price1 } = await prisma.item.findUnique({
      where: { id: itemId1 },
    });
    const { price: price2 } = await prisma.item.findUnique({
      where: { id: itemId2 },
    });

    const date = new Date();
    date.setDate(date.getDate() - 1);

    await prisma.sale.create({
      data: {
        createdAt: j <= 9 ? date : undefined,
        updatedAt: j <= 9 ? date : undefined,
        saleDetails: {
          create: [
            { amount: amount1, itemId: itemId1, unitPrice: price1 },
            { amount: amount2, itemId: itemId2, unitPrice: price2 },
          ],
        },
      },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
