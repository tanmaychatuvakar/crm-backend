import { Request, Response } from "express";
import findArgsSchema from "./schemas/find-args.schema";
import photoshootsService from "./photoshoots.service";
import { parseIncludes } from "@/utils";
import defineAbility from "@/casl/casl-ability.factory";
import { accessibleBy } from "@casl/prisma";
import { Role } from "@prisma/client";
import imagesService from "./images/images.service";
import { z } from "zod";

const findAll = async (
  req: Request<void, void, void, z.infer<typeof findArgsSchema>>,
  res: Response
) => {
  const { page, pageSize, status, include } = req.query;
  const relationships = parseIncludes(include);
  const ability = defineAbility(req.user);

  const [total, photoshoots] = await Promise.all([
    photoshootsService.count({
      where: {
        AND: [
          accessibleBy(ability).Photoshoot,
          {
            deletedAt: null,
            status: {
              in: status,
            },
          },
        ],
      },
    }),
    photoshootsService.findAll({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        AND: [
          accessibleBy(ability).Photoshoot,
          {
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
        photoRequest: relationships.includes("photoRequest"),
        photographer: relationships.includes("photographer"),
        editor: relationships.includes("editor"),
        photographerImages: relationships.includes("photographerImages"),
        editorImages: relationships.includes("editorImages"),
        listings: relationships.includes("listings"),
      },
    }),
  ]);
  res.send({ total, data: photoshoots });
};

const assign = async (req: Request, res: Response) => {
  const result = await photoshootsService.assign(req.params.id, req.body);
  res.send(result);
};

const submit = async (req: Request, res: Response) => {
  const result = await photoshootsService.update({
    where: {
      id: req.params.id,
    },
    data: {
      //TODO: IF SET TO PHOTOS EDITED, THE LISTING SHOULD BE AWAITING PUBLISH
      //TODO: IMPORTANT, THIS CHECK IS INVALID IN CASE THE USER IS PHOTOGRAPHER AND EDITOR AT THE SAME TIME
      status: req.user.is(Role.PHOTOGRAPHER)
        ? "PHOTOS_UPLOADED"
        : "PHOTOS_EDITED",
    },
  });
  res.send(result);
};

const approve = async (req: Request, res: Response) => {
  const result = await photoshootsService.approve(req.params.id);
  res.send(result);
};

const upload = async (req: Request, res: Response) => {
  const identifiers = JSON.parse(req.body.identifiers);
  await photoshootsService.upload(
    req.params.id,
    (req.files as Express.MulterS3.File[])?.map((file, i) => ({
      id: identifiers[i],
      location: file.location,
      objectKey: file.key,
    })),
    req.user.is(Role.PHOTOGRAPHER) ? "photographer" : "editor"
  );
  res.send(identifiers);
};

const reAssign = async (req: Request, res: Response) => {
  await photoshootsService.reAssign(req.params.id, req.body);
  res.sendStatus(200);
};

const deleteImage = async (req: Request, res: Response) => {
  await imagesService.destroy(req.params.imageId);
  res.sendStatus(200);
};

export default {
  findAll,
  assign,
  upload,
  submit,
  approve,
  reAssign,
  deleteImage,
};
