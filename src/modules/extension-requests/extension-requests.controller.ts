import defineAbility from "@/casl/casl-ability.factory";
import { Request, Response } from "express";
import extensionRequestsService from "./extension-requests.service";

import findArgsSchema from "./schemas/find-args.schema";
import { parseIncludes } from "@/utils";
import { accessibleBy } from "@casl/prisma";

const findOne = async (req: Request, res: Response) => {
  const relationships = parseIncludes(req.query.include);
  const result = await extensionRequestsService.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      listing: relationships.includes("listing")
        ? { include: { features: true, amenities: true } }
        : false,
    },
  });
  res.send(result);
};

const findAll = async (req: Request, res: Response) => {
  const { page, pageSize, isSale, isRental, include, status } =
    await findArgsSchema.parseAsync(req.query);
  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, extensionRequests] = await Promise.all([
    extensionRequestsService.count({
      where: {
        AND: [
          accessibleBy(ability).ExtensionRequest,
          {
            listing: {
              isSale,
              isRental,
            },
            deletedAt: null,
            status: {
              in: status,
            },
          },
        ],
      },
    }),
    extensionRequestsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).ExtensionRequest,
          {
            listing: {
              isSale,
              isRental,
            },
            deletedAt: null,
            status: {
              in: status,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listing: relationships.includes("listing"),
      },
    }),
  ]);
  res.send({ total, data: extensionRequests });
};

const create = async (req: Request, res: Response) => {
  const result = await extensionRequestsService.create(req.user.id, req.body);
  res.status(201).send(result);
};

const approve = async (req: Request, res: Response) => {
  const result = await extensionRequestsService.approve(req.params.id);
  res.send(result);
};

const reject = async (req: Request, res: Response) => {
  const result = await extensionRequestsService.reject(req.params.id, req.body);
  res.send(result);
};

export default {
  findOne,
  findAll,
  create,
  approve,
  reject,
};
