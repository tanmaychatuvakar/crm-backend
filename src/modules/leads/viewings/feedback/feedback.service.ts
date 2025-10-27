import { z } from "zod";
import createFeedbackSchema from "./schemas/update.schema";
import client from "@/db/client";
import { BadRequestException } from "@/exceptions/http/bad-request.exception";

const update = async (
  viewingId: string,
  data: z.infer<typeof createFeedbackSchema>
) => {
  const viewing = await client.viewing.findUniqueOrThrow({
    where: { id: viewingId },
  });

  if (!viewing.completedAt) {
    throw new BadRequestException("Viewing is not completed yet");
  }

  return await client.feedback.update({
    where: {
      viewingId,
    },
    data: {
      community: data.community,
      location: data.location,
      floor: data.floor,
      view: data.view,
      floorPlanLayout: data.floorPlanLayout,
      area: data.area,
      condition: data.condition,
      price: data.price,
      amenities: data.amenities,
      parking: data.parking,
      acType: data.acType,

      serviceCharge: data.serviceCharge,
      furnitureCondition: data.furnitureCondition,
      appliancesCondition: data.appliancesCondition,
    },
  });
};

export default {
  update,
};
