import client from "@/db/client";
import { Prisma } from "@prisma/client";

const findAll = async (args?: Prisma.TeamFindManyArgs) => {
  return await client.team.findMany(args);
};

const findOne = async (args: Prisma.TeamFindUniqueArgs) => {
  return await client.team.findUnique(args);
};

const count = async (args?: Prisma.TeamCountArgs) => {
  return await client.team.count(args);
};

const create = async (args: Prisma.TeamCreateArgs) => {
  return await client.team.create(args);
};

const update = async (args: Prisma.TeamUpdateArgs) => {
  return await client.team.update(args);
};

const destroy = async (teamId: string) => {
  return await client.team.update({
    where: { id: teamId },
    data: {
      deletedAt: new Date(),
    },
  });
};

export default {
  findAll,
  count,
  create,
  destroy,
  update,
  findOne
};
