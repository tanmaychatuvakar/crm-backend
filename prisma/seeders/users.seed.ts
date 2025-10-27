import { PrismaClient } from "@prisma/client";
import hashingService from "../../src/modules/iam/hashing.service";

export default async (prisma: PrismaClient) => {
  const email = "admin@domain.com";

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (user) {
    return;
  }

  const password = await hashingService.hash("Admin@123");
  await prisma.user.create({
    data: {
      name: "Administrator",
      email,
      password,
      role: "ADMINISTRATOR",
    },
  });
};
