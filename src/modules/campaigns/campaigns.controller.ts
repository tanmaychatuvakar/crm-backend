import { Request, Response } from "express";
import campaignsService from "./campaigns.service";
import { z } from "zod";
import createCampaignSchema from "./schemas/create.schema";
import findCampaignsSchema from "./schemas/find-all.schema";
import updateCampaignSchema from "./schemas/update.schema";
import { parseIncludes } from "@/utils";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findCampaignsSchema>>,
  res: Response
) => {
  const { page, pageSize, q, include } = req.query;
  const relationships = parseIncludes(include);

  const [total, campaigns] = await Promise.all([
    campaignsService.count({
      where: {
        deletedAt: null,
        name: {
          mode: "insensitive",
          contains: q,
        },
      },
    }),
    campaignsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        deletedAt: null,
        name: {
          mode: "insensitive",
          contains: q,
        },
      },
      include: {
        team: relationships.includes("team"),
        source: relationships.includes("source"),
      },
    }),
  ]);
  res.send({ total, data: campaigns });
};

const findOne = async (req: Request, res: Response) => {
  const result = await campaignsService.findOne({
    where: { id: req.params.id },
  });
  res.send(result);
};

const create = async (
  req: Request<{}, {}, z.infer<typeof createCampaignSchema>>,
  res: Response
) => {
  const result = await campaignsService.create({
    data: {
      name: req.body.name,
      sourceId: req.body.sourceId,
      teamId: req.body.teamId,
    },
  });

  res.status(201).send(result);
};

const update = async (
  req: Request<{ id: string }, {}, z.infer<typeof updateCampaignSchema>>,
  res: Response
) => {
  const result = await campaignsService.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name,
      teamId: req.body.teamId,
      sourceId: req.body.sourceId,
    },
  });
  res.send(result);
};

const destroy = async (req: Request, res: Response) => {
  await campaignsService.destroy(req.params.id);
  res.sendStatus(204);
};

export default {
  create,
  findAll,
  update,
  destroy,
  findOne,
};
