import client from "@/db/client";
import { z } from "zod";
import createUnpublishRequestSchema from "./schemas/create.schema";
import { Prisma } from "@prisma/client";
import rejectUnpublishRequestSchema from "./schemas/reject.schema";
import { ForbiddenException } from "@/exceptions/http/forbidden.exception";

const findOne = async (args: Prisma.UnpublishRequestFindFirstArgs) => {
  return await client.unpublishRequest.findFirst(args);
};

const findAll = async (args?: Prisma.UnpublishRequestFindManyArgs) => {
  return await client.unpublishRequest.findMany(args);
};

const create = async (
  userId: string,
  body: z.infer<typeof createUnpublishRequestSchema>
) => {
  return client.$transaction(async (tx) => {
    const listing = await tx.listing.findUniqueOrThrow({
      where: {
        id: body.listingId,
      },
    });

    if (listing.assigneeId !== userId) throw new ForbiddenException();

    return tx.unpublishRequest.create({
      data: {
        listing: {
          connect: {
            id: body.listingId,
          },
        },
        comments: body.comments,
      },
    });
  });
};

const count = async (args: Prisma.UnpublishRequestCountArgs) => {
  return await client.unpublishRequest.count(args);
};

const cancel = async (unpublishRequestId: string) => {
  return await client.unpublishRequest.update({
    where: { id: unpublishRequestId },
    data: {
      status: "CANCELED",
    },
  });
};

const approve = async (unpublishRequestId: string) => {
  return await client.$transaction(async (tx) => {
    const unpublishRequest = await tx.unpublishRequest.update({
      where: { id: unpublishRequestId },
      data: {
        status: "APPROVED",
      },
    });
    await tx.listing.update({
      where: {
        id: unpublishRequest.listingId,
      },
      data: {
        status: "UNPUBLISHED",
        publishedAt: null,
      },
    });
    return unpublishRequest;
  });
};

const reject = async (
  unpublishRequestId: string,
  data: z.infer<typeof rejectUnpublishRequestSchema>
) => {
  return await client.unpublishRequest.update({
    where: {
      id: unpublishRequestId,
    },
    data: {
      status: "REJECTED",
      rejectionReason: data.rejectionReason,
    },
  });
};

export default { findOne, findAll, create, count, cancel, approve, reject };
