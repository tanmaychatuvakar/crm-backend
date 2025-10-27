import { PrismaClient } from '@prisma/client';
import locationTree from '../datasets/location-tree.json';

export default (prisma: PrismaClient) =>
  locationTree.map(city =>
    prisma.city.upsert({
      where: { name: city.value },
      create: {
        name: city.value,
        communities: {
          create: city.nodes.map(c => {
            const subcommunities = (c.nodes as any[]).filter(n => n.value !== null);
            return {
              name: c.value,
              subcommunities:
                subcommunities.length > 0
                  ? {
                      create: subcommunities.map(s => {
                        const properties = (s.nodes as any[]).filter(n => n.value !== null);
                        return {
                          name: s.value,
                          properties: properties.length > 0 ? { create: properties.map(p => ({ name: p.value })) } : undefined,
                        };
                      }),
                    }
                  : undefined,
            };
          }),
        },
      },
      update: { name: city.value },
    }),
  );
