import client from "@/db/client";

export default async (now: Date | "manual" | "init") => {
  await client.listing.updateMany({
    where: {
      status: "PUBLISHED",
      expiresAt: {
        not: null,
        lte: new Date(),
      },
    },
    data: {
      status: "EXPIRED",
      assigneeId: null,
      publishedAt: null,
    },
  });
};
