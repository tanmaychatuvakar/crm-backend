import client from "@/db/client";

export default async (now: Date | "manual" | "init") => {
  await client.lead.updateMany({
    where: {
      expiresAt: {
        not: null,
        lte: new Date(),
      },
    },
    data: {
      expiresAt: null,
      assigneeId: null,
    },
  });
};
