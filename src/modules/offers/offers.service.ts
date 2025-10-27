import client from "@/db/client";
import { Prisma } from "@prisma/client";

const findAll = async (args?: Prisma.OfferFindManyArgs) => {
  return await client.offer.findMany(args);
};

const count = async (args: Prisma.OfferCountArgs) => {
  return await client.offer.count(args);
};

export default {
  findAll,
  count,
};
