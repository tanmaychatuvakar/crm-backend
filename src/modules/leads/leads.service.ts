import { z } from "zod";

import client from "@/db/client";
import { Prisma } from "@prisma/client";
import offersService from "./offers/offers.service";
import contactsService from "./contacts/contacts.service";
import { addHours } from "date-fns";
import rejectLeadSchema from "./schemas/reject.schema";
import { BadRequestException } from "@/exceptions/http/bad-request.exception";

const findAll = async (args?: Prisma.LeadFindManyArgs) => {
  return await client.lead.findMany(args);
};

const count = async (args?: Prisma.LeadCountArgs) => {
  return await client.lead.count(args);
};

const findOne = async (args: Prisma.LeadFindUniqueArgs) => {
  return await client.lead.findUnique(args);
};

const create = async (args: Prisma.LeadCreateArgs) => {
  return await client.lead.create(args);
};

const approve = async (leadId: string) => {
  return await client.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status: "NEW",
      expiresAt: addHours(new Date(), 1),
    },
  });
};

const reject = async (
  leadId: string,
  body: z.infer<typeof rejectLeadSchema>
) => {
  return await client.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status: "REJECTED",
      rejectionReason: body.rejectionReason,
    },
  });
};

const offers = {
  create: async (userId: string, leadId: string, data: any) => {
    return await offersService.create(userId, leadId, data);
  },
  accept: async (leadId: string, offerId: string) => {
    return await offersService.accept(offerId);
  },
  reject: async (leadId: string, offerId: string) => {
    return await offersService.reject(offerId);
  },
  negotiate: async (leadId: string, offerId: string) => {
    return await offersService.negotiate(offerId);
  },
  convert: async (leadId: string, offerId: string, unpublish: boolean) => {
    return await offersService.convert(offerId, unpublish);
  },
};

const contact = {
  update: async (leadId: string, body: any) => {
    return await contactsService.update(leadId, body);
  },
};

const pickUp = async (leadId: string, userId: string) => {
  return await client.$transaction(async (tx) => {
    const lead = await tx.lead.findUniqueOrThrow({ where: { id: leadId } });

    if (lead.assigneeId !== null)
      throw new BadRequestException("Lead is already assigned");

    return await tx.lead.update({
      where: { id: leadId },
      data: { assigneeId: userId, expiresAt: addHours(new Date(), 1) },
    });
  });
};

// const match = async () => {
//   client.lead.findMany({
//     where: {
//       preference,
//     },
//   });
// };

export default {
  findAll,
  create,
  count,
  approve,
  reject,
  findOne,
  offers,
  contact,
  pickUp,
};
