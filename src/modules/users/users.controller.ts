import { accessibleBy } from "@casl/prisma";
import { Request, Response } from "express";
import usersService from "./users.service";
import findArgsSchema from "./schemas/find-args.schema";

import updateUserSchema from "./schemas/update.schema";
import { z } from "zod";
import defineAbility from "@/casl/casl-ability.factory";
import hashingService from "../iam/hashing.service";
import { Prisma } from "@prisma/client";

const findAll = async (req: Request, res: Response) => {
  const { page, pageSize, search, include, flat } =
    await findArgsSchema.parseAsync(req.query);

  const ability = defineAbility(req.user);

  let skip;
  let take;

  if (!flat) {
    skip = (page - 1) * pageSize;
    take = pageSize;
  }

  const [total, users] = await Promise.all([
    usersService.count({
      where: {
        AND: [
          accessibleBy(ability).User,
          { deletedAt: null },
          {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
    }),
    usersService.findAll({
      skip,
      take,
      where: {
        AND: [
          accessibleBy(ability).User,
          { deletedAt: null },
          {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);
  res.send({ total, data: users });
};

const create = async (req: Request, res: Response) => {
  const result = await usersService.create(req.body);
  res.status(201).send(result);
};

const destroy = async (req: Request, res: Response) => {
  await usersService.destroy(req.params.id);
  res.sendStatus(204);
};

const update = async (
  req: Request<{ id: string }, any, z.infer<typeof updateUserSchema>>,
  res: Response
) => {
  const data: Prisma.UserUpdateInput = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    role: req.body.role,
    phoneNumberCountryCode: req.body.phoneNumberCountryCode,
  };

  if (req.body.password) {
    data.password = await hashingService.hash(req.body.password);
  }

  const result = await usersService.update({
    where: { id: req.params.id },
    data,
  });

  res.send(result);
};

const hold = async (req: Request, res: Response) => {
  const result = await usersService.hold(req.params.id);
  res.send(result);
};

export default { findAll, create, destroy, update, hold };
