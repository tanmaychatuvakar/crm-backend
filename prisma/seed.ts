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
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    console.log('');
    
    // await Promise.all([
    console.log('🌱 Seeding categories...');
    const categories = categoriesSeeder(prisma);
    for (const promise of categories) {
      await promise;
      console.log('✅ Category processed');
    }
    
    console.log('🌱 Seeding amenities...');
    const amenities = amenitiesSeeder(prisma);
    for (const promise of amenities) {
      await promise;
      console.log('✅ Amenity processed');
    }
    
    console.log('🌱 Seeding features...');
    const features = featuresSeeder(prisma);
    for (const promise of features) {
      await promise;
      console.log('✅ Feature processed');
    }
    
    console.log('🌱 Seeding sources...');
    const sources = sourcesSeeder(prisma);
    for (const promise of sources) {
      await promise;
      console.log('✅ Source processed');
    }
    
    console.log('🌱 Seeding nationalities...');
    const nationalities = nationalitiesSeeder(prisma);
    for (const promise of nationalities) {
      await promise;
      console.log('✅ Nationality processed');
    }
    
    // await leadTypesSeeder(prisma);
    
    console.log('🌱 Seeding locations...');
    const locations = locationsSeeder(prisma);
    for (const promise of locations) {
      await promise;
      console.log('✅ Location processed');
    }
    // ]);
    console.log('🌱 Seeding users...');
    await usersSeeder(prisma);
    console.log('✅ Users seeded');
    console.log('');
    console.log('✅ All seeding completed successfully!');
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully!');
  } catch (e) {
    console.error('');
    console.error('❌ Error during seeding:');
    console.error('Error message:', e instanceof Error ? e.message : String(e));
    console.error('Error stack:', e instanceof Error ? e.stack : 'No stack trace available');
    console.error('Full error:', e);
    console.error('');
    try {
      await prisma.$disconnect();
      console.log('🔌 Database disconnected after error');
    } catch (disconnectError) {
      console.error('❌ Error disconnecting from database:', disconnectError);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unhandled error in main function:', error);
  process.exit(1);
});
