import { PrismaClient } from '@prisma/client';
import features from '../datasets/features.json';

export default (prisma: PrismaClient) =>
  features.map(feature =>
    prisma.feature.upsert({
      where: {
        name: feature,
      },
      update: {},
      create: { name: feature },
    }),
  );
