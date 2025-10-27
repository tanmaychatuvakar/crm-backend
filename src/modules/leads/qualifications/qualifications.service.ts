import { z } from "zod";
import createQualificationSchema from "./schemas/update.schema";
import client from "@/db/client";
import { addDays } from "date-fns";

const update = async (
  leadId: string,
  data: z.infer<typeof createQualificationSchema>
) => {
  return await client.$transaction(async (tx) => {
    const lead = await tx.lead.findUniqueOrThrow({ where: { id: leadId } });

    await tx.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        status: "QUALIFIED",
        expiresAt: addDays(new Date(), 1),
      },
    });

    return await tx.qualification.update({
      where: {
        leadId,
      },
      data: {
        budget: data.budget,
        timeline: data.timeline,
        levelOfInterest: data.levelOfInterest,
        spokenLanguage: data.spokenLanguage,
        nationalityId: data.nationalityId,
        customerType: data.customerType,
        finance: data.finance,
        buyerType: data.buyerType,
        qualifiedAt: new Date(),
      },
    });
  });
};

export default { update };
