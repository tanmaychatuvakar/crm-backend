import { PrismaClient } from '@prisma/client';
import amenities from '../datasets/amenities.json';

export default (prisma: PrismaClient) =>
  amenities.map(amenity =>
    prisma.amenity.upsert({
      where: { code: amenity.code },
      update: { name: amenity.name, commercial: amenity.commercial, private: amenity.private },
      create: { name: amenity.name, code: amenity.code, commercial: amenity.commercial, private: amenity.private },
    }),
  );
