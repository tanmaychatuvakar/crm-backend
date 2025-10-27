import { PrismaClient } from "@prisma/client";

import categoriesSeeder from "./seeders/categories.seed";
import amenitiesSeeder from "./seeders/amenities.seed";
import featuresSeeder from "./seeders/features.seed";
import sourcesSeeder from "./seeders/sources.seed";
import nationalitiesSeeder from "./seeders/nationalities.seed";
import locationsSeeder from "./seeders/locations.seed";
import usersSeeder from "./seeders/users.seed";
// import leadTypesSeeder from './seeders/lead-types.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    // await Promise.all([
    await Promise.all(categoriesSeeder(prisma));
    await Promise.all(amenitiesSeeder(prisma));
    await Promise.all(featuresSeeder(prisma));
    await Promise.all(sourcesSeeder(prisma));
    await Promise.all(nationalitiesSeeder(prisma));
    // await leadTypesSeeder(prisma);
    await Promise.all(locationsSeeder(prisma));
    // ]);
    await usersSeeder(prisma);
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
