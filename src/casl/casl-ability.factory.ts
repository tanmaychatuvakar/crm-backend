import { Action } from "./enums/action.enum";
import { ActiveUser } from "@/types/active-user.type";
import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import {
  PhotoRequest,
  User,
  Listing,
  UnpublishRequest,
  ExtensionRequest,
  Photoshoot,
  Contact,
  Role,
  Lead,
  LeadExtensionRequest,
  Viewing,
  Offer,
  LeadContact,
  Deal,
} from "@prisma/client";

type AppAbility = PureAbility<
  [
    string,
    Subjects<{
      User: User;
      PhotoRequest: PhotoRequest;
      Listing: Listing;
      ExtensionRequest: ExtensionRequest;
      UnpublishRequest: UnpublishRequest;
      Photoshoot: Photoshoot;
      Contact: Contact;
      Lead: Lead;
      LeadExtensionRequest: LeadExtensionRequest;
      Viewing: Viewing;
      Offer: Offer;
      LeadContact: LeadContact;
      Deal: Deal;
    }>,
  ],
  PrismaQuery
>;

const defineAbility = (user: ActiveUser) => {
  const { can, build, cannot } = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );

  cannot(Action.Read, "Listing");
  cannot(Action.Read, "PhotoRequest");
  cannot(Action.Read, "ExtensionRequest");
  cannot(Action.Read, "UnpublishRequest");
  cannot(Action.Read, "Photoshoot");
  cannot(Action.Read, "Contact");
  cannot(Action.Read, "Lead");
  cannot(Action.Read, "LeadExtensionRequest");
  cannot(Action.Read, "User");
  cannot(Action.Read, "Viewing");
  cannot(Action.Read, "Offer");
  cannot(Action.Read, "LeadContact");
  cannot(Action.Read, "Deal");

  cannot(Action.Create, "ExtensionRequest");
  cannot(Action.Create, "UnpublishRequest");

  if (user.is(Role.ADMINISTRATOR)) {
    can(Action.Read, "User");
  }

  if (user.is(Role.AGENT)) {
    can(Action.Read, "Listing", {
      OR: [{ assigneeId: user.id }, { status: "PUBLISHED" }],
    });
    can(Action.Read, "PhotoRequest", { listing: { assigneeId: user.id } });
    can(Action.Read, "ExtensionRequest", { listing: { assigneeId: user.id } });
    can(Action.Read, "UnpublishRequest", { listing: { assigneeId: user.id } });
    can(Action.Read, "Contact", { userId: user.id });
    can(Action.Read, "Lead", { assigneeId: user.id });
    can(Action.Read, "Viewing", { lead: { assigneeId: user.id } });
    can(Action.Read, "Offer", { lead: { assigneeId: user.id } });
    can(Action.Read, "LeadContact", { lead: { assigneeId: user.id } });
    can(Action.Read, "LeadExtensionRequest", { lead: { assigneeId: user.id } });
    can(Action.Read, "Deal", { offer: { lead: { assigneeId: user.id } } });
    // create
    can(Action.Create, "ExtensionRequest", {
      listing: { assigneeId: user.id },
    });
    can(Action.Create, "UnpublishRequest", {
      listing: { assigneeId: user.id },
    });
  }

  if (user.is(Role.LISTING_DEPARTMENT)) {
    can(Action.Read, "PhotoRequest");
    can(Action.Read, "Photoshoot");
    can(Action.Read, "Listing");
    can(Action.Read, "UnpublishRequest");
    can(Action.Read, "User", { role: "AGENT" });
    can(Action.Read, "Contact");
  }

  if (user.is(Role.PHOTOGRAPHER)) {
    can(Action.Read, "Photoshoot", { photographerId: user.id });
  }

  if (user.is(Role.EDITOR)) {
    can(Action.Read, "Photoshoot", { editorId: user.id });
  }

  if (user.is(Role.LINE_MANAGER)) {
    can(Action.Read, "ExtensionRequest");
    can(Action.Read, "Lead", { status: "PENDING" });
    can(Action.Read, "LeadExtensionRequest");
  }

  return build();
};

export default defineAbility;
