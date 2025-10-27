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
    const categories = categoriesSeeder(prisma);
    for (const promise of categories) {
      await promise;
    }
    
    const amenities = amenitiesSeeder(prisma);
    for (const promise of amenities) {
      await promise;
    }
    
    const features = featuresSeeder(prisma);
    for (const promise of features) {
      await promise;
    }
    
    const sources = sourcesSeeder(prisma);
    for (const promise of sources) {
      await promise;
    }
    
    const nationalities = nationalitiesSeeder(prisma);
    for (const promise of nationalities) {
      await promise;
    }
    
    // await leadTypesSeeder(prisma);
    
    const locations = locationsSeeder(prisma);
    for (const promise of locations) {
      await promise;
    }
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
