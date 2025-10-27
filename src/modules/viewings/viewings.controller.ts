import { Request, Response } from "express";
import viewingsService from "./viewings.service";
import findViewingsSchema from "./schemas/find-args.schema";
import { z } from "zod";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { parseIncludes } from "@/utils";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findViewingsSchema>>,
  res: Response
) => {
  const { page, pageSize, search, include } = req.query;
  const relationships = parseIncludes(include);

  const ability = defineAbility(req.user);

  const [total, users] = await Promise.all([
    viewingsService.count({
      where: {
        AND: [
          accessibleBy(ability).Viewing,
          { listing: { title: { contains: search, mode: "insensitive" } } },
        ],
      },
    }),
    viewingsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).Viewing,
          { listing: { title: { contains: search, mode: "insensitive" } } },
        ],
      },
      include: {
        listing: relationships.includes("listing")
          ? {
              include: {
                city: true,
                community: true,
                subcommunity: true,
                property: true,
              },
            }
          : false,
        lead: relationships.includes("lead"),
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);
  res.send({ total, data: users });
};

const cancel = async (req: Request, res: Response) => {
  const result = await viewingsService.cancel(req.user.id, req.params.id);
  res.send(result);
};

export default { findAll, cancel };
