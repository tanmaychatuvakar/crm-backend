import { z } from "zod";

import createViewingSchema from "./schemas/create.schema";
import client from "@/db/client";
import { addDays } from "date-fns";

const create = async (
  userId: string,
  leadId: string,
  data: z.infer<typeof createViewingSchema>
) => {
  return await client.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id: leadId },
      data: {
        expiresAt: addDays(new Date(), 7),
      },
    });

    const listingType = data.listing?.type;

    let listingId = data.listingId;

    if (!listingId) {
      const listing = await tx.listing.create({
        data: {
          title: "Unspecified Listing Title",
          isSale: listingType === "SALE",
          isRental: listingType === "RENTAL",
          numberOfBedrooms: data.listing?.numberOfBedrooms,
          numberOfBathrooms: data.listing?.numberOfBathrooms,
          furnished: data.listing?.furnished,
          salePrice: listingType === "SALE" ? data.listing?.price : null,
          rentalPrice: listingType === "RENTAL" ? data.listing?.price : null,
          categoryId: data.listing?.categoryId,
          cityId: data.listing?.cityId,
          communityId: data.listing?.communityId,
          subcommunityId: data.listing?.subcommunityId,
          propertyId: data.listing?.propertyId,
        },
      });
      listingId = listing.id;
    }

    return await tx.viewing.create({
      data: {
        userId,
        leadId,

        scheduledAt: data.scheduledAt,
        listingId,

        feedback: { create: {} },
      },
    });
  });
};

export default {
  create,
};
