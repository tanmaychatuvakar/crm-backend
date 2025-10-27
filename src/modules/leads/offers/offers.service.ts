import { z } from "zod";
import createOfferSchema from "./schemas/create.schema";
import updateOfferSchema from "./schemas/update.schema";
import client from "@/db/client";
import { BadRequestException } from "@/exceptions/http/bad-request.exception";
import dealsService from "../deals/deals.service";

import { addDays } from "date-fns";

const hasAcceptedOffer = async (leadId: string) => {
  const count = await client.offer.count({
    where: { leadId, status: "ACCEPTED" },
  });
  return count > 0;
};

const update = async (
  offerId: string,
  data: z.infer<typeof updateOfferSchema>
) => {
  const offer = await client.offer.findUniqueOrThrow({
    where: { id: offerId },
  });

  const accepted = await hasAcceptedOffer(offer.leadId);
  if (accepted) {
    throw new BadRequestException();
  }

  return await client.offer.update({
    where: {
      id: offerId,
    },
    data: {
      viewingId: data.viewingId,
      price: data.price,
    },
  });
};

const create = async (
  userId: string,
  leadId: string,
  data: z.infer<typeof createOfferSchema>
) => {
  return await client.$transaction(async (tx) => {
    const lead = await tx.lead.findUniqueOrThrow({
      where: { id: leadId },
    });

    const accepted = await hasAcceptedOffer(leadId);
    if (accepted) {
      throw new BadRequestException();
    }

    const viewing = await tx.viewing.findUniqueOrThrow({
      where: { id: data.viewingId },
    });

    await tx.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        expiresAt: addDays(new Date(), 3),
      },
    });

    return await tx.offer.create({
      data: {
        userId,
        leadId,
        ...data,
      },
    });
  });
};

const negotiate = async (offerId: string) => {
  const offer = await client.offer.findUniqueOrThrow({
    where: { id: offerId },
  });

  const accepted = await hasAcceptedOffer(offer.leadId);
  if (accepted) {
    throw new BadRequestException();
  }

  if (offer.status !== "SUBMITTED") {
    throw new BadRequestException();
  }

  return await client.offer.update({
    where: {
      id: offerId,
    },
    data: {
      status: "NEGOTIATION",
    },
  });
};

const accept = async (offerId: string) => {
  const offer = await client.offer.findUniqueOrThrow({
    where: { id: offerId },
  });

  const accepted = await hasAcceptedOffer(offer.leadId);
  if (accepted) {
    throw new BadRequestException();
  }

  if (offer.status === "REJECTED") {
    throw new BadRequestException();
  }

  return await client.offer.update({
    where: {
      id: offerId,
    },
    data: {
      status: "ACCEPTED",
    },
  });
};

const reject = async (offerId: string) => {
  const offer = await client.offer.findUniqueOrThrow({
    where: { id: offerId },
  });

  const accepted = await hasAcceptedOffer(offer.leadId);
  if (accepted) {
    throw new BadRequestException();
  }

  if (offer.status === "ACCEPTED") {
    throw new BadRequestException();
  }

  return await client.offer.update({
    where: {
      id: offerId,
    },
    data: {
      status: "REJECTED",
    },
  });
};

const convert = async (offerId: string, unpublish: boolean) => {
  const offer = await client.offer.findUniqueOrThrow({
    where: { id: offerId },
    include: { lead: true },
  });

  if (offer.status !== "ACCEPTED") {
    throw new BadRequestException();
  }

  return await client.$transaction(async (tx) => {
    if (unpublish && offer.lead.listingId) {
      await tx.listing.update({
        where: {
          id: offer.lead.listingId,
        },
        data: {
          status: "UNPUBLISHED",
          expiresAt: null,
        },
      });
    }
    return await dealsService.create(offer.id);
  });
};

export default {
  create,
  update,
  accept,
  reject,
  negotiate,
  convert,
};
