import { Request, Response } from "express";
import leadsService from "./leads.service";
import findArgsSchema from "./schemas/find-args.schema";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { parseIncludes } from "@/utils";
import { NotFoundException } from "@/exceptions/http/not-found.exception";
import { z } from "zod";
import createLeadSchema from "./schemas/create.schema";
import { addMinutes } from "date-fns";

const findOne = async (req: Request, res: Response) => {
  const relationships = parseIncludes(req.query.include);

  const result = await leadsService.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      listing: relationships.includes("listing"),
      source: relationships.includes("source"),
      contact: relationships.includes("contact"),
      qualification: relationships.includes("qualification")
        ? { include: { lead: { include: { listing: true } } } }
        : false,
      viewings: relationships.includes("viewings")
        ? {
            orderBy: { createdAt: "desc" },
            include: {
              user: { select: { name: true } },
              listing: {
                include: {
                  city: true,
                  community: true,
                  subcommunity: true,
                  property: true,
                },
              },
              feedback: true,
            },
          }
        : false,
      offers: relationships.includes("offers")
        ? {
            orderBy: { createdAt: "desc" },
            include: {
              viewing: {
                include: {
                  listing: {
                    include: {
                      city: true,
                      community: true,
                      subcommunity: true,
                      property: true,
                      category: true,
                    },
                  },
                },
              },
              user: { select: { name: true } },
              deal: true,
            },
          }
        : false,
    },
  });
  if (!result) {
    throw new NotFoundException();
  }
  res.send(result);
};

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findArgsSchema>>,
  res: Response
) => {
  const { search, page, pageSize, status, include } = req.query;

  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, leads] = await Promise.all([
    leadsService.count({
      where: {
        AND: [
          accessibleBy(ability).Lead,
          {
            contact: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            status: {
              in: status,
            },
          },
        ],
      },
    }),
    leadsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).Lead,
          {
            contact: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            status: {
              in: status,
            },
          },
        ],
      },
      include: {
        source: relationships.includes("source"),
        contact: relationships.includes("contact"),
        preference: relationships.includes("preference")
          ? { include: { city: true, category: true } }
          : false,
        listing: relationships.includes("listing"),
        viewings: relationships.includes("viewings")
          ? { include: { listing: true } }
          : false,
        _count: relationships.includes("count")
          ? {
              select: {
                offers: true,
                viewings: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  res.send({ total, data: leads });
};

const pool = async (req: Request, res: Response) => {
  const { search, page, pageSize, status, include } =
    await findArgsSchema.parseAsync(req.query);

  const relationships = parseIncludes(include);

  const [total, leads] = await Promise.all([
    leadsService.count({
      where: {
        assigneeId: null,
        contact: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        status: {
          in: status,
        },
      },
    }),
    leadsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        assigneeId: null,
        contact: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        status: {
          in: status,
        },
      },
      include: {
        contact: relationships.includes("contact"),
        preference: relationships.includes("preference"),
        listing: relationships.includes("listing"),
        _count: relationships.includes("count")
          ? {
              select: {
                offers: true,
                viewings: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  res.send({ total, data: leads });
};

const create = async (
  req: Request<{}, {}, z.infer<typeof createLeadSchema>>,
  res: Response
) => {
  const result = await leadsService.create({
    data: {
      expiresAt: addMinutes(new Date(), 90),
      listingId: req.body.listingId,
      assigneeId: req.user.id,
      sourceId: req.body.sourceId,
      subsource: req.body.subsource,
      contact: {
        create: {
          title: req.body.title,
          name: req.body.name,
          mobileNumber: req.body.mobileNumber,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          nationalityId: req.body.nationalityId,
          language: req.body.language,
          type: req.body.type,
        },
      },
      preference: {
        create: {
          cityId: req.body.cityId,
          communityId: req.body.communityId,
          subcommunityId: req.body.subcommunityId,
          propertyId: req.body.propertyId,
          categoryId: req.body.categoryId,

          minBedrooms: req.body.minBedrooms,
          maxBedrooms: req.body.maxBedrooms,
          minPrice: req.body.minPrice,
          maxPrice: req.body.maxPrice,
          minArea: req.body.minArea,
          maxArea: req.body.maxArea,
        },
      },
    },
  });
  res.status(201).send(result);
};

const approve = async (req: Request, res: Response) => {
  const result = await leadsService.approve(req.params.id);
  res.send(result);
};

const reject = async (req: Request, res: Response) => {
  const result = await leadsService.reject(req.params.id, req.body);
  res.send(result);
};

const offers = {
  create: async (req: Request, res: Response) => {
    const result = await leadsService.offers.create(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(201).send(result);
  },
  accept: async (req: Request, res: Response) => {
    const result = await leadsService.offers.accept(
      req.params.leadId,
      req.params.offerId
    );
    res.send(result);
  },
  reject: async (req: Request, res: Response) => {
    const result = await leadsService.offers.reject(
      req.params.leadId,
      req.params.offerId
    );
    res.send(result);
  },
  negotiate: async (req: Request, res: Response) => {
    const result = await leadsService.offers.negotiate(
      req.params.leadId,
      req.params.offerId
    );
    res.send(result);
  },
  convert: async (req: Request, res: Response) => {
    const result = await leadsService.offers.convert(
      req.params.leadId,
      req.params.offerId,
      Boolean(req.body.unpublish)
    );
    res.send(result);
  },
};

const contact = {
  update: async (req: Request, res: Response) => {
    const result = await leadsService.contact.update(req.params.id, req.body);
    res.send(result);
  },
};

const pickUp = async (req: Request, res: Response) => {
  const result = await leadsService.pickUp(req.params.id, req.user.id);
  res.send(result);
};

export default {
  findAll,
  create,
  approve,
  reject,
  findOne,
  offers,
  contact,
  pool,
  pickUp,
};
