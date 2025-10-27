import client from "@/db/client";
import { Prisma } from "@prisma/client";

const findOne = async (args: Prisma.CampaignFindUniqueArgs) => {
  return await client.campaign.findUnique(args);
};

const findAll = async (args?: Prisma.CampaignFindManyArgs) => {
  return await client.campaign.findMany(args);
};

const count = async (args?: Prisma.CampaignCountArgs) => {
  return await client.campaign.count(args);
};

const create = async (args: Prisma.CampaignCreateArgs) => {
  return await client.campaign.create(args);
};

const update = async (args: Prisma.CampaignUpdateArgs) => {
  return await client.campaign.update(args);
};

const destroy = async (campaignId: string) => {
  return await client.campaign.update({
    where: { id: campaignId },
    data: { deletedAt: new Date() },
  });
};

export default { findOne, create, findAll, count, update, destroy };
