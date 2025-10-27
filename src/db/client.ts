import {
  DB_USER,
  DB_ADDRESS,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME,
  BASE_URI,
} from "@/config";
import { LeadContact, PrismaClient } from "@prisma/client";

const datasourceUrl = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_ADDRESS}:${DB_PORT}/${DB_NAME}?schema=public`;

const formatNull = (input: any, defaultValue: string) => input ?? defaultValue;

const computePrettyResponse = (contact: LeadContact) => {
  switch (contact.response) {
    case "CONTACT_LATER":
      return "Contact Later";
    case "INTERESTED":
      return "Interested";
    case "NOT_INTERESTED":
      return "Not Interested";
    default:
      return null;
  }
};

const computePrettyChannel = (contact: LeadContact) => {
  switch (contact.channel) {
    case "CALL":
      return "Call";
    case "CHAT":
      return "Chat";
    case "EMAIL":
      return "Email";
    case "SMS":
      return "SMS";
    case "WHATSAPP":
      return "WhatsApp";
    default:
      return null;
  }
};

const computePrettyType = (contact: LeadContact) => {
  switch (contact.type) {
    case "BUYER":
      return "Buyer";
    case "LANDLORD":
      return "Landlord";
    case "SELLER":
      return "Seller";
    case "TENANT":
      return "Tenant";
    default:
      return null;
  }
};

const client = new PrismaClient({
  omit: {
    user: {
      password: true,
      passwordResetToken: true,
      passwordResetExpiration: true,
    },
  },
  datasourceUrl,
}).$extends({
  result: {
    lead: {
      reference: {
        needs: { referenceId: true },
        compute: ({ referenceId }) => `DP-L-${referenceId}`,
      },
    },

    offer: {
      reference: {
        needs: { referenceId: true },
        compute: ({ referenceId }) => `DP-OF-${referenceId}`,
      },
    },

    leadContact: {
      prettyResponse: {
        needs: { response: true },
        compute: computePrettyResponse,
      },
      prettyChannel: {
        needs: { channel: true },
        compute: computePrettyChannel,
      },
      prettyType: {
        needs: { type: true },
        compute: computePrettyType,
      },
      reference: {
        needs: { referenceId: true },
        compute: ({ referenceId }) => `DP-CL-${referenceId}`,
      },
    },
    campaign: {
      webhook: {
        needs: { id: true },
        compute(campaign) {
          return `${BASE_URI}/webhook?campaignId=${campaign.id}`;
        },
      },
    },
    listing: {
      reference: {
        needs: { referenceId: true, isSale: true, isRental: true },
        compute(listing) {
          if (listing.isSale) {
            if (listing.isRental) {
              return `DP-SR-${listing.referenceId}`;
            }
            return `DP-S-${listing.referenceId}`;
          }
          return `DP-R-${listing.referenceId}`;
        },
      },
    },
  },
});

export default client;
