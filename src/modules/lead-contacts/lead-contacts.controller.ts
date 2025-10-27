import { Request, Response } from "express";
import leadContactsService from "./lead-contacts.service";
import findLeadContactsSchema from "./schemas/find-args.schema";
import { z } from "zod";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { parseIncludes } from "@/utils";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findLeadContactsSchema>>,
  res: Response
) => {
  const { page, pageSize, search, include } = req.query;
  const relationships = parseIncludes(include);

  const ability = defineAbility(req.user);

  const [total, users] = await Promise.all([
    leadContactsService.count({
      where: {
        AND: [
          accessibleBy(ability).LeadContact,
          {
            lead: {
              listing: { title: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      },
    }),
    leadContactsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).LeadContact,
          {
            lead: {
              listing: { title: { contains: search, mode: "insensitive" } },
            },
          },
        ],
      },
      include: {
        lead: relationships.includes("lead"),
        nationality: relationships.includes("nationality"),
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);
  res.send({ total, data: users });
};

export default { findAll };
