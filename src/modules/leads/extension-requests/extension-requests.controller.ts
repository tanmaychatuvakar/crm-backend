import { Request, Response } from "express";
import extensionRequestsService from "./extension-requests.service";
import findArgsSchema from "./schemas/find-args.schema";
import { accessibleBy } from "@casl/prisma";
import defineAbility from "@/casl/casl-ability.factory";
import { parseIncludes } from "@/utils";
import { z } from "zod";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findArgsSchema>>,
  res: Response
) => {
  const { page, pageSize, include, status } = req.query;
  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, leads] = await Promise.all([
    extensionRequestsService.count({
      where: {
        AND: [
          accessibleBy(ability).LeadExtensionRequest,
          { status: { in: status } },
        ],
      },
    }),
    extensionRequestsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).LeadExtensionRequest,
          { status: { in: status } },
        ],
      },
      include: {
        lead: relationships.includes("lead"),
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  res.send({ total, data: leads });
};

const create = async (req: Request, res: Response) => {
  const result = await extensionRequestsService.create(req.body);
  res.status(201).send(result);
};

const approve = async (req: Request, res: Response) => {
  const result = await extensionRequestsService.approve(req.params.id);
  res.send(result);
};

const reject = async (req: Request, res: Response) => {
  const result = await extensionRequestsService.reject(req.params.id);
  res.send(result);
};

export default {
  create,
  approve,
  reject,
  findAll,
};
