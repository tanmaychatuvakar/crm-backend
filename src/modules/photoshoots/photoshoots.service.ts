import client from "@/db/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import assignPhotoshootSchema from "./schemas/assign.schema";
import reAssignPhotoshootSchema from "./schemas/re-assign.schema";
import listingsService from "../listings/listings.service";

const findAll = async (args?: Prisma.PhotoshootFindManyArgs) => {
  return await client.photoshoot.findMany(args);
};

const update = async (args: Prisma.PhotoshootUpdateArgs) => {
  return await client.photoshoot.update(args);
};

const count = async (args: Prisma.PhotoshootCountArgs) => {
  return await client.photoshoot.count(args);
};

const assign = async (
  photoshootId: string,
  data: z.infer<typeof assignPhotoshootSchema>
) => {
  return await client.photoshoot.update({
    where: { id: photoshootId },
    data: {
      status: "ASSIGNED",
      photographer: {
        connect: { id: data.photographerId },
      },
      editor: {
        connect: { id: data.editorId },
      },
    },
  });
};

const approve = async (photoshootId: string) => {
  return await client.$transaction(async (tx) => {
    const photoshoot = await tx.photoshoot.update({
      where: { id: photoshootId },
      data: { status: "DONE" },
      select: { photoRequest: { select: { listingId: true } } },
    });

    const ids = await listingsService.handleSplitListing(
      photoshoot.photoRequest.listingId
    );
    await tx.listing.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: "AWAITING_PUBLISH",
      },
    });
    return photoshoot;
  });
};

const upload = async (
  photoshootId: string,
  images: { id: string; location: string; objectKey: string }[],
  role: "photographer" | "editor"
) => {
  return await client.photoshoot.update({
    where: {
      id: photoshootId,
    },
    data: {
      [role === "photographer" ? "photographerImages" : "editorImages"]: {
        create: images.map((i) => ({
          id: i.id,
          location: i.location,
          objectKey: i.objectKey,
          role: "",
        })),
      },
    },
  });
};

const reAssign = async (
  photoshootId: string,
  data: z.infer<typeof reAssignPhotoshootSchema>
) => {
  return await client.photoshoot.update({
    where: { id: photoshootId },
    data: {
      status: data.assignTo === "PHOTOGRAPHER" ? "ASSIGNED" : "PHOTOS_UPLOADED",
      rejectionReason: data.rejectionReason,
    },
  });
};

export default {
  findAll,
  count,
  assign,
  update,
  approve,
  upload,
  reAssign,
};
