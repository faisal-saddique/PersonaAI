import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@personaai.com" },
    update: {},
    create: {
      email: "admin@personaai.com",
      name: "Admin User",
      password: adminPassword,
      type: "admin",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("1234", 10);
  await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      password: userPassword,
      type: "user",
    },
  });

  // Create another regular user
  const user2Password = await bcrypt.hash("pass123", 10);
  await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      email: "sarah@example.com",
      name: "Sarah Johnson",
      password: user2Password,
      type: "user",
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });