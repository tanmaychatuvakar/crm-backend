import { Request, Response } from "express";
import dealsService from "./deals.service";
import { accessibleBy } from "@casl/prisma";
import { z } from "zod";

import findArgsSchema from "./schemas/find-args.schema";
import { parseIncludes } from "@/utils";
import defineAbility from "@/casl/casl-ability.factory";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findArgsSchema>>,
  res: Response
) => {
  const { page, pageSize, include } = req.query;

  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, leads] = await Promise.all([
    dealsService.count({
      where: {
        AND: [accessibleBy(ability).Deal],
      },
    }),
    dealsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [accessibleBy(ability).Deal],
      },
      include: {
        offer: relationships.includes("offer"),
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  res.send({ total, data: leads });
};

export default { findAll };
