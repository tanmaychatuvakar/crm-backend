import { PrismaClient } from '@prisma/client';
import nationalities from '../datasets/nationalities.json';

export default (prisma: PrismaClient) =>
  nationalities.map(nationality =>
    prisma.nationality.upsert({
      where: { name: nationality },
      update: {},
      create: { name: nationality },
    }),
  );
