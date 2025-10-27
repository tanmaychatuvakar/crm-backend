import client from "@/db/client";

const create = async (offerId: string) => {
  return client.$transaction(async (tx) => {
    const offer = await tx.offer.findUniqueOrThrow({ where: { id: offerId } });

    await tx.lead.update({
      where: { id: offer.leadId },
      data: {
        status: "CLOSED",
        expiresAt: null,
      },
    });

    return await client.deal.create({
      data: {
        offerId,
      },
    });
  });
};

export default { create };
