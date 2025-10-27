import { Request, Response } from "express";
import findTeamsSchema from "./schemas/find-all.schema";
import teamsService from "./teams.service";
import { z } from "zod";
import createTeamSchema from "./schemas/create.schema";
import updateTeamSchema from "./schemas/update.schema";
import { parseIncludes } from "@/utils";

const findAll = async (
  req: Request<{}, {}, {}, z.infer<typeof findTeamsSchema>>,
  res: Response
) => {
  const { page, pageSize, q, include, flat } = req.query;
  const relationships = parseIncludes(include);

  let skip;
  let take;

  if (!flat) {
    skip = (page - 1) * pageSize;
    take = pageSize;
  }

  const [total, campaigns] = await Promise.all([
    teamsService.count({
      where: {
        deletedAt: null,
        name: {
          mode: "insensitive",
          contains: q,
        },
      },
    }),
    teamsService.findAll({
      skip,
      take,
      where: {
        deletedAt: null,
        name: {
          mode: "insensitive",
          contains: q,
        },
      },
      include: {
        _count: {
          select: {
            users: true, //Todo: fix this performance
          },
        },
        users: relationships.includes("users") && { select: { name: true } },
      },
    }),
  ]);
  res.send({ total, data: campaigns });
};

const findOne = async (req: Request, res: Response) => {
  const relationships = parseIncludes(req.query.include);
  const result = await teamsService.findOne({
    where: { id: req.params.id },
    include: {
      users: relationships.includes("users")
        ? { select: { id: true, name: true } }
        : false,
    },
  });

  res.send(result);
};

const create = async (
  req: Request<{}, {}, z.infer<typeof createTeamSchema>>,
  res: Response
) => {
  const result = await teamsService.create({
    data: {
      name: req.body.name,
      users: {
        connect: req.body.users.map((userId) => ({ id: userId })),
      },
    },
  });
  res.status(201).send(result);
};

const update = async (
  req: Request<{ id: string }, {}, z.infer<typeof updateTeamSchema>>,
  res: Response
) => {
  const { name, users } = req.body;
  const result = await teamsService.update({
    where: { id: req.params.id },
    data: {
      name,
      users: {
        set: users.map((userId) => ({ id: userId })),
      },
    },
  });
  res.send(result);
};

const destroy = async (req: Request, res: Response) => {
  await teamsService.destroy(req.params.id);
  res.sendStatus(204);
};

export default { findAll, create, destroy, update, findOne };
