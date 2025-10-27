import client from "@/db/client";
import { BadRequestException } from "@/exceptions/http/bad-request.exception";
import { ForbiddenException } from "@/exceptions/http/forbidden.exception";
import { Prisma } from "@prisma/client";

const findAll = async (args?: Prisma.ViewingFindManyArgs) => {
  return await client.viewing.findMany(args);
};

const count = async (args: Prisma.ViewingCountArgs) => {
  return await client.viewing.count(args);
};

const cancel = async (userId: string, viewingId: string) => {
  const viewing = await client.viewing.findUniqueOrThrow({
    where: { id: viewingId },
    include: { lead: true },
  });

  if (viewing.lead.assigneeId !== userId) throw new ForbiddenException();

  if (viewing.cancelledAt !== null) throw new BadRequestException();

  return await client.viewing.update({
    where: { id: viewing.id },
    data: {
      cancelledAt: new Date(),
    },
  });
};

export default {
  findAll,
  count,
  cancel,
};
