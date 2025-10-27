import { Prisma } from "@prisma/client";
import { z } from "zod";
import invokeWebhookSchema from "./schemas/invoke.schema";
import campaignsService from "../campaigns/campaigns.service";
import { NotFoundException } from "@/exceptions/http/not-found.exception";
import leadsService from "../leads/leads.service";
import { addMinutes } from "date-fns";

type CampaignWithTeamAndUsers = Prisma.CampaignGetPayload<{
  include: {
    team: {
      include: {
        users: true;
      };
    };
  };
}>;

const invoke = async (
  campaignId: string,
  data: z.infer<typeof invokeWebhookSchema>
) => {
  const record = await campaignsService.findOne({
    where: { id: campaignId, deletedAt: null },
    include: {
      team: {
        include: {
          users: true,
        },
      },
    },
  });

  if (!record) {
    throw new NotFoundException("campaign not found");
  }

  const campaign = record as unknown as CampaignWithTeamAndUsers;
  const users = campaign.team.users;

  const assignee = users[Math.floor(Math.random() * users.length)];

  return await leadsService.create({
    data: {
      expiresAt: addMinutes(new Date(), 90),
      campaignId,
      type: "CAMPAIGN",
      sourceId: campaign.sourceId,
      assigneeId: assignee.id,
      contact: {
        create: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
      },
    },
  });
};

export default { invoke };
