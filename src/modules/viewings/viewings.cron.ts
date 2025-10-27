import client from "@/db/client";

export default async (now: Date | "manual" | "init") => {
  await client.viewing.updateMany({
    where: {
      completedAt: null,
      scheduledAt: {
        lte: new Date(),
      },
    },
    data: {
      completedAt: new Date(),
    },
  });
};
