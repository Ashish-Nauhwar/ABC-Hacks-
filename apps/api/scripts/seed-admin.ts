import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "dashboard.admin@test.local";
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    console.log("Admin user already exists in Supabase:", existing.id);
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      phone: "+91 99999 99999",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin user created in Supabase:", user.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
