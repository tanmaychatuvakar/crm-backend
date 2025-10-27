import client from "@/db/client";
import { Prisma } from "@prisma/client";

const findAll = async (args?: Prisma.LeadContactFindManyArgs) => {
  return await client.leadContact.findMany(args);
};

const count = async (args: Prisma.LeadContactCountArgs) => {
  return await client.leadContact.count(args);
};

export default {
  findAll,
  count,
};
