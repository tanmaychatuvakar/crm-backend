import { z } from "zod";
import updateContactSchema from "./schemas/update.schema";
import client from "@/db/client";
import { addDays } from "date-fns";
import { BadRequestException } from "@/exceptions/http/bad-request.exception";

const update = async (
  leadId: string,
  data: z.infer<typeof updateContactSchema>
) => {
  return await client.$transaction(async (tx) => {
    let lead = await tx.lead.findUniqueOrThrow({ where: { id: leadId } });

    const contact = await tx.leadContact.update({
      where: { leadId },
      data: {
        contactable: data.contactable,
        channel: data.channel,
        response: data.response,
      },
    });

    if (data.channel && lead.status === "NEW") {
      lead = await tx.lead.update({
        where: { id: leadId },
        data: { status: "CALLED" },
      });
    }

    if (data.response && lead.status === "CALLED") {
      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "CONTACTED",
          expiresAt: addDays(new Date(), 1),
          qualification: { create: {} },
        },
      });
    }

    return contact;
  });
};

export default {
  update,
};
