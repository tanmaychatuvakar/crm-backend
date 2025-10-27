import { z } from "zod";
import createExtensionRequestSchema from "./schemas/create.schema";
import client from "@/db/client";
import { Prisma } from "@prisma/client";
import rejectExtenstionRequestSchema from "./schemas/reject.schema";

import { ForbiddenException } from "@/exceptions/http/forbidden.exception";
import { addDays, addMinutes } from "date-fns";

const findOne = async (args: Prisma.ExtensionRequestFindFirstArgs) => {
  return await client.extensionRequest.findFirst(args);
};

const findAll = async (args?: Prisma.ExtensionRequestFindManyArgs) => {
  return await client.extensionRequest.findMany(args);
};

const count = async (args: Prisma.ExtensionRequestCountArgs) => {
  return await client.extensionRequest.count(args);
};

const create = async (
  userId: string,
  data: z.infer<typeof createExtensionRequestSchema>
) => {
  return await client.$transaction(async (tx) => {
    const listing = await tx.listing.findUniqueOrThrow({
      where: {
        id: data.listingId,
      },
    });

    if (listing.assigneeId !== userId) throw new ForbiddenException();

    return await tx.extensionRequest.create({
      data: {
        comments: data.comments,
        listingId: listing.id,
        fromDate: listing.expiresAt,
      },
    });
  });
};

const approve = async (extensionRequestId: string) => {
  return await client.$transaction(async (tx) => {
    const { listing } = await tx.extensionRequest.findUniqueOrThrow({
      where: { id: extensionRequestId },
      select: {
        listing: { select: { id: true, isSale: true } },
      },
    });

    const expiresAt = addDays(new Date(), listing.isSale ? 90 : 30);

    await tx.listing.update({
      where: { id: listing.id },
      data: { expiresAt },
    });

    return tx.extensionRequest.update({
      where: { id: extensionRequestId },
      data: {
        status: "APPROVED",
        toDate: expiresAt,
      },
    });
  });
};

const reject = async (
  extensionRequestId: string,
  data: z.infer<typeof rejectExtenstionRequestSchema>
) => {
  return await client.extensionRequest.update({
    where: { id: extensionRequestId },
    data: {
      status: "REJECTED",
      rejectionReason: data.rejectionReason,
    },
  });
};

export default {
  findOne,
  findAll,
  create,
  count,
  approve,
  reject,
};
