import { Request, Response } from "express";
import unpublishRequestsService from "./unpublish-requests.service";
import findArgsSchema from "./schemas/find-args.schema";
import { parseIncludes } from "@/utils";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";

const findOne = async (req: Request, res: Response) => {
  const relationships = parseIncludes(req.query.include);
  const result = await unpublishRequestsService.findOne({
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
  const { page, pageSize, isSale, isRental, status, include } =
    await findArgsSchema.parseAsync(req.query);
  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, unpublishRequests] = await Promise.all([
    unpublishRequestsService.count({
      where: {
        AND: [
          accessibleBy(ability).UnpublishRequest,
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
    unpublishRequestsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).UnpublishRequest,
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

  res.send({ total, data: unpublishRequests });
};

const create = async (req: Request, res: Response) => {
  const result = await unpublishRequestsService.create(req.user.id, req.body);
  res.status(201).json(result);
};

const cancel = async (req: Request, res: Response) => {
  const result = await unpublishRequestsService.cancel(req.params.id);
  res.send(result);
};

const approve = async (req: Request, res: Response) => {
  const result = await unpublishRequestsService.approve(req.params.id);
  res.send(result);
};

const reject = async (req: Request, res: Response) => {
  const result = await unpublishRequestsService.reject(req.params.id, req.body);
  res.send(result);
};

export default { findOne, findAll, create, cancel, approve, reject };
