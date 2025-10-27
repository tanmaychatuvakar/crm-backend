import { Request, Response } from "express";
import offersService from "./offers.service";
import findOffersSchema from "./schemas/find-args.schema";
import { z } from "zod";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { parseIncludes } from "@/utils";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findOffersSchema>>,
  res: Response
) => {
  const { page, pageSize, search, include } = req.query;
  const relationships = parseIncludes(include);

  const ability = defineAbility(req.user);

  const [total, users] = await Promise.all([
    offersService.count({
      where: {
        AND: [
          accessibleBy(ability).Offer,
          {
            lead: {
              listing: { title: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      },
    }),
    offersService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).Offer,
          {
            lead: {
              listing: { title: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      },
      include: {
        lead: relationships.includes("lead")
          ? {
              include: {
                listing: {
                  include: {
                    city: true,
                    community: true,
                    subcommunity: true,
                    property: true,
                  },
                },
              },
            }
          : false,
        deal: relationships.includes("deal"),
        viewing: relationships.includes("viewing"),
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);
  res.send({ total, data: users });
};

export default { findAll };
