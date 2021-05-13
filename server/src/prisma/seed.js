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
