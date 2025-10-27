import { Request, Response } from "express";
import photoRequestsService from "./photo-requests.service";
import findArgsSchema from "./schemas/find-args.schema";
import { parseIncludes } from "@/utils";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { z } from "zod";

const findOne = async (req: Request, res: Response) => {
  const relationships = parseIncludes(req.query.include);
  const result = await photoRequestsService.findOne({
    where: { id: req.params.id },
    include: {
      listing: relationships.includes("listing")
        ? { include: { features: true, amenities: true } }
        : false,
      photoshoot: relationships.includes("photoshoot")
        ? { include: { photographerImages: true, editorImages: true } }
        : false,
    },
  });
  res.send(result);
};

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findArgsSchema>>,
  res: Response
) => {
  const { page, pageSize, status, isSale, isRental, include } = req.query;
  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, photoRequests] = await Promise.all([
    photoRequestsService.count({
      where: {
        AND: [
          accessibleBy(ability).PhotoRequest,
          {
            deletedAt: null,
            listing: {
              isSale,
              isRental,
            },
            status: {
              in: status,
            },
          },
        ],
      },
    }),
    photoRequestsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).PhotoRequest,
          {
            deletedAt: null,
            listing: {
              isSale,
              isRental,
            },
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
        photoshoot: relationships.includes("photoshoot")
          ? {
              include: {
                photographer: {
                  select: {
                    name: true,
                  },
                },
                editor: {
                  select: {
                    name: true,
                  },
                },
              },
            }
          : false,
      },
    }),
  ]);

  res.send({ total, data: photoRequests });
};

// const updateStatus = async (req: Request, res: Response) => {
//   const result = await photoRequestsService.update({
//     where: {
//       id: req.params.id,
//     },
//     data: {
//       status: req.body.status,
//       rejectionReason: req.body.rejectionReason,
//     },
//   });
//   res.send(result);
// };

const create = async (req: Request, res: Response) => {
  const result = await photoRequestsService.create(req.body);
  res.status(201).send(result);
};

const approve = async (req: Request, res: Response) => {
  const result = await photoRequestsService.approve(req.params.id);
  res.send(result);
};

const cancel = async (req: Request, res: Response) => {
  const result = await photoRequestsService.cancel(req.params.id);
  res.send(result);
};

const reject = async (req: Request, res: Response) => {
  const result = await photoRequestsService.reject(req.params.id, req.body);
  res.send(result);
};

/**
 * if (data.status === PhotoRequestStatus.CANCELED || data.status === PhotoRequestStatus.REJECTED) {
    await prismaClient.listing.update({
      where: {
        id: photoRequest.listingId,
      },
      data: {
        status: ListingStatus.DRAFT,
      },
    });
  }
 */

export default {
  findAll,
  findOne,
  create,
  cancel,
  approve,
  reject,
};
