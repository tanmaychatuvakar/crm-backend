import { Request, Response } from "express";
import listingsService from "./listings.service";

import findArgsSchema from "./schemas/find-args.schema";
import { parseIncludes } from "@/utils";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { z } from "zod";
import { NotFoundException } from "@/exceptions/http/not-found.exception";
import { ForbiddenError } from "@casl/ability";
import { ForbiddenException } from "@/exceptions/http/forbidden.exception";
import client from "@/db/client";

const findOne = async (req: Request, res: Response) => {
  const relationships = parseIncludes(req.query.include);
  const result = await listingsService.findOne({
    where: { id: req.params.id },
    include: {
      features: relationships.includes("features"),
      amenities: relationships.includes("amenities"),
      photoshoot: relationships.includes("photoshoot")
        ? { include: { photographerImages: true, editorImages: true } }
        : false,
      extensionRequests: relationships.includes("extensionRequests")
        ? { where: { status: "PENDING" } }
        : false,
      unpublishRequests: relationships.includes("unpublishRequests")
        ? { where: { status: "PENDING" } }
        : false,
    },
  });
  res.send(result);
};

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findArgsSchema>>,
  res: Response
) => {
  const {
    search,
    page,
    pageSize,
    status,
    isExclusive,
    isSale,
    isRental,
    include,
  } = req.query;
  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, listings] = await Promise.all([
    listingsService.count({
      where: {
        AND: [
          accessibleBy(ability).Listing,
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
            status: {
              in: status,
            },
            isExclusive,
            isSale,
            isRental,
            deletedAt: null,
          },
        ],
      },
    }),
    listingsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).Listing,
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
            status: {
              in: status,
            },
            isExclusive,
            isSale,
            isRental,
            deletedAt: null,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: relationships.includes("category"),
        city: relationships.includes("city"),
        community: relationships.includes("community"),
        subcommunity: relationships.includes("subcommunity"),
        property: relationships.includes("property"),

        agent: relationships.includes("agent")
          ? { select: { name: true } }
          : false,
        assignee: relationships.includes("assignee")
          ? { select: { name: true } }
          : false,

        publisher: true,
        photoshoot: {
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
            photographerImages: true,
            editorImages: true,
          },
        },
      },
    }),
  ]);

  res.send({ total, data: listings });
};

const create = async (req: Request, res: Response) => {
  const result = await listingsService.create(req.user.id, req.body);
  res.status(201).send(result);
};

const update = async (req: Request, res: Response) => {
  const result = await listingsService.update(req.params.id, req.body);
  res.send(result);
};

const destroy = async (req: Request, res: Response) => {
  await listingsService.destroy(req.params.id);
  res.sendStatus(204);
};

const publish = async (req: Request, res: Response) => {
  const result = await listingsService.publish(
    req.user.id,
    req.params.id,
    req.body.trakheesi
  );
  res.send(result);
};

const republish = async (req: Request, res: Response) => {
  const result = await listingsService.republish(req.params.id);
  res.send(result);
};

const archive = async (req: Request, res: Response) => {
  const result = await listingsService.archive(req.user.id, req.params.id);
  res.send(result);
};

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
  publish,
  republish,
  archive,
};
