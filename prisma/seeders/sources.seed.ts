import { PrismaClient, SourceIntent } from '@prisma/client';
import listingSources from '../datasets/listing-sources.json';
import leadSources from '../datasets/lead-sources.json';

export default (prisma: PrismaClient) => [
  ...listingSources.map(source =>
    prisma.source.upsert({
      where: { name_intent: { name: source, intent: SourceIntent.LISTING } },
      update: {},
      create: { name: source, intent: SourceIntent.LISTING },
    }),
  ),
  ...leadSources.map(source =>
    prisma.source.upsert({
      where: { name_intent: { name: source, intent: SourceIntent.LEAD } },
      update: {},
      create: { name: source, intent: SourceIntent.LEAD },
    }),
  ),
];
