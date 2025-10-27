import client from "@/db/client";
import { Prisma } from "@prisma/client";

const findAll = async (args?: Prisma.DealFindManyArgs) => {
  return await client.deal.findMany(args);
};

const count = async (args: Prisma.DealCountArgs) => {
  return await client.deal.count(args);
};

export default { findAll, count };
