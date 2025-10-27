import { z } from "zod";
import createExtensionRequestSchema from "./schemas/create.schema";
import client from "@/db/client";
import { Prisma } from "@prisma/client";
import { addMonths } from "date-fns";

const findAll = async (args?: Prisma.LeadExtensionRequestFindManyArgs) => {
  return await client.leadExtensionRequest.findMany(args);
};

const count = async (args?: Prisma.LeadExtensionRequestCountArgs) => {
  return await client.leadExtensionRequest.count(args);
};

const create = async (data: z.infer<typeof createExtensionRequestSchema>) => {
  return await client.leadExtensionRequest.create({
    data: {
      lead: {
        connect: {
          id: data.leadId,
        },
      },
      reason: data.reason,
    },
  });
};

const approve = async (extensionRequestId: string) => {
  return await client.$transaction(async (tx) => {
    const extensionRequest = await tx.leadExtensionRequest.update({
      where: {
        id: extensionRequestId,
      },
      data: {
        status: "APPROVED",
      },
      select: {
        leadId: true,
        lead: {
          select: {
            expiresAt: true,
          },
        },
      },
    });
    await tx.lead.update({
      where: {
        id: extensionRequest.leadId,
      },
      data: {
        expiresAt: addMonths(extensionRequest.lead.expiresAt!, 1),
      },
    });
    return extensionRequest;
  });
};

const reject = async (extensionRequestId: string) => {
  return await client.leadExtensionRequest.update({
    where: {
      id: extensionRequestId,
    },
    data: {
      status: "REJECTED",
    },
  });
};

export default { create, approve, reject, findAll, count };
