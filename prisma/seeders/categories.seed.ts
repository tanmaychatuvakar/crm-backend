import { PrismaClient } from "@prisma/client";
import categories from "../datasets/categories.json";

export default (prisma: PrismaClient) =>
  categories.map((category) =>
    prisma.category.upsert({
      where: { code: category.code },
      update: { name: category.name },
      create: { name: category.name, code: category.code },
    })
  );
