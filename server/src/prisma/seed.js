const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const password = await hash("12345678", 10);

  await prisma.user.create({
    data: {
      username: "user",
      password,
      name: "Mason Greenwood",
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
