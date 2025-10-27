import { Prisma } from "@prisma/client";
import createListingSchema from "./schemas/create.schema";
import client from "@/db/client";
import { z } from "zod";
import { NotFoundException } from "@/exceptions/http/not-found.exception";
import { addDays } from "date-fns";
import { ForbiddenException } from "@/exceptions/http/forbidden.exception";

const findOne = async (args: Prisma.ListingFindFirstArgs) => {
  return await client.listing.findFirst(args);
};

const findAll = async (args?: Prisma.ListingFindManyArgs) => {
  return await client.listing.findMany(args);
};

const count = async (args?: Prisma.ListingCountArgs) => {
  return await client.listing.count(args);
};

const create = async (
  agentId: string,
  data: z.infer<typeof createListingSchema>
) => {
  return await client.listing.create({
    data: {
      title: data.title,
      description: data.description,
      agentId,
      categoryId: data.categoryId,
      totalArea: data.totalArea,
      plotArea: data.plotArea,
      numberOfBedrooms: data.numberOfBedrooms,
      numberOfBathrooms: data.numberOfBathrooms,
      furnished: data.furnished,
      appliances: data.appliances,
      parking: data.parking,
      propertyStatus: data.propertyStatus,
      cityId: data.cityId,
      communityId: data.communityId,
      subcommunityId: data.subcommunityId,
      propertyId: data.propertyId,
      unitNumber: data.unitNumber,
      streetNumber: data.streetNumber,
      floor: data.floor,
      view: data.view,
      askForPrice: data.askForPrice,
      pricePerSqft: data.pricePerSqft,
      salePrice: data.isSale ? data.salePrice : null,
      features: {
        connect: data.features.map((f) => ({ id: f })),
      },
      amenities: {
        connect: data.amenities.map((a) => ({ id: a })),
      },

      isRental: data.isRental,
      isCommercial: data.isCommercial,
      isExclusive: data.isExclusive,
      isHalfBath: data.isHalfBath,
      isPrimary: data.isPrimary,
      isRented: data.isRented,
      isSale: data.isSale,
      rentedFrom: data.isRented ? data.rentedFrom : null,
      rentedUntil: data.isRented ? data.rentedUntil : null,
      rentedPrice: data.isRented ? data.rentedPrice : null,
      rentedCheques: data.isRented ? data.rentedCheques : null,
      tenant: data.isRented ? data.tenant : null,
      rentalAvailableFrom: data.isRental ? data.rentalAvailableFrom : null,
      rentalCheques: data.isRental ? data.rentalCheques : null,
      rentalLeaseTerm: data.isRental ? data.rentalLeaseTerm : null,
      rentalPrice: data.isRental ? data.rentalPrice : null,
      contactId: data.contactId,
      assigneeId: agentId,
      serviceCharge: data.serviceCharge,
      fitted: data.fitted,
      sourceId: data.sourceId,
      str: data.str,

      brokerContractRentalDocument:
        data.brokerContractRentalDocument ?? Prisma.JsonNull,
      brokerContractSaleDocument:
        data.brokerContractSaleDocument ?? Prisma.JsonNull,
      titleDeedDocument: data.titleDeedDocument ?? Prisma.JsonNull,
      poaDocument: data.poaDocument ?? Prisma.JsonNull,
      ownerIdDocument: data.ownerIdDocument ?? Prisma.JsonNull,
      otherDocument: data.otherDocument ?? Prisma.JsonNull,
    },
  });
};

const update = async (
  listingId: string,
  data: z.infer<typeof createListingSchema>
) => {
  return await client.listing.update({
    where: {
      id: listingId,
    },
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      totalArea: data.totalArea,
      plotArea: data.plotArea,
      numberOfBedrooms: data.numberOfBedrooms,
      numberOfBathrooms: data.numberOfBathrooms,
      furnished: data.furnished,
      appliances: data.appliances,
      parking: data.parking,
      propertyStatus: data.propertyStatus,
      cityId: data.cityId,
      communityId: data.communityId,
      subcommunityId: data.subcommunityId,
      propertyId: data.propertyId,
      unitNumber: data.unitNumber,
      streetNumber: data.streetNumber,
      floor: data.floor,
      view: data.view,
      askForPrice: data.askForPrice,
      pricePerSqft: data.pricePerSqft,
      salePrice: data.isSale ? data.salePrice : null,
      features: {
        set: data.features.map((f) => ({ id: f })),
      },
      amenities: {
        set: data.amenities.map((a) => ({ id: a })),
      },

      isRental: data.isRental,
      isCommercial: data.isCommercial,
      isExclusive: data.isExclusive,
      isHalfBath: data.isHalfBath,
      isPrimary: data.isPrimary,
      isRented: data.isRented,
      isSale: data.isSale,
      rentedFrom: data.isRented ? data.rentedFrom : null,
      rentedUntil: data.isRented ? data.rentedUntil : null,
      rentedCheques: data.isRented ? data.rentedCheques : null,
      rentedPrice: data.isRented ? data.rentedPrice : null,
      tenant: data.isRented ? data.tenant : null,
      rentalAvailableFrom: data.isRental ? data.rentalAvailableFrom : null,
      rentalCheques: data.isRental ? data.rentalCheques : null,
      rentalLeaseTerm: data.isRental ? data.rentalLeaseTerm : null,
      rentalPrice: data.isRental ? data.rentalPrice : null,
      contactId: data.contactId,
      serviceCharge: data.serviceCharge,
      fitted: data.isCommercial ? data.fitted : null,
      sourceId: data.sourceId,
      str: data.str,

      brokerContractRentalDocument:
        data.brokerContractRentalDocument ?? Prisma.JsonNull,
      brokerContractSaleDocument:
        data.brokerContractSaleDocument ?? Prisma.JsonNull,
      titleDeedDocument: data.titleDeedDocument ?? Prisma.JsonNull,
      poaDocument: data.poaDocument ?? Prisma.JsonNull,
      ownerIdDocument: data.ownerIdDocument ?? Prisma.JsonNull,
      otherDocument: data.otherDocument ?? Prisma.JsonNull,
    },
  });
};

const destroy = async (listingId: string) => {
  return await client.listing.update({
    where: {
      id: listingId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

const publish = async (
  userId: string,
  listingId: string,
  trakheesi: string
) => {
  return await client.$transaction(async (tx) => {
    const listing = await tx.listing.findUniqueOrThrow({
      where: { id: listingId },
    });
    return await tx.listing.update({
      where: {
        id: listingId,
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        publisherId: userId,
        expiresAt: addDays(new Date(), listing.isSale ? 90 : 30),
        trakheesi,
      },
    });
  });
};

const archive = async (userId: string, listingId: string) => {
  const listing = await client.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new NotFoundException();
  }

  if (listing.assigneeId !== userId) {
    throw new ForbiddenException();
  }

  return await client.listing.update({
    where: { id: listingId, status: "UNPUBLISHED" },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date(),
    },
  });
};

const republish = async (listingId: string) => {
  return await client.listing.update({
    where: { id: listingId },
    data: {
      status: "AWAITING_PUBLISH",
    },
  });
};

const handleSplitListing = async (listingId: string) => {
  return await client.$transaction(async (tx) => {
    const listing = await tx.listing.findUniqueOrThrow({
      where: { id: listingId },
      include: { features: true, amenities: true },
    });

    if (listing.isSale && listing.isRental) {
      // rentalAvailableFrom, rentalCheques, rentalLeaseTerm, rentalPrice, isRental
      // salePrice, isSale

      // make it rental only
      await tx.listing.update({
        where: { id: listing.id },
        data: {
          isSale: false,
          salePrice: null,
        },
      });

      // create a duplicate sale only
      const newListing = await tx.listing.create({
        data: {
          referenceId: listing.referenceId,
          isSale: true,
          isRental: false,
          cityId: listing.cityId,
          communityId: listing.communityId,
          subcommunityId: listing.subcommunityId,
          propertyId: listing.propertyId,
          title: listing.title,
          description: listing.description,
          unitNumber: listing.unitNumber,
          totalArea: listing.totalArea,
          plotArea: listing.plotArea,
          numberOfBedrooms: listing.numberOfBedrooms,
          numberOfBathrooms: listing.numberOfBathrooms,
          floor: listing.floor,
          view: listing.view,
          furnished: listing.furnished,
          appliances: listing.appliances,
          parking: listing.parking,
          streetNumber: listing.streetNumber,
          salePrice: listing.salePrice,
          sourceId: listing.sourceId,
          isHalfBath: listing.isHalfBath,
          isPrimary: listing.isPrimary,
          askForPrice: listing.askForPrice,
          isExclusive: listing.isExclusive,
          isCommercial: listing.isCommercial,
          isRented: listing.isRented,
          fitted: listing.fitted,
          features: {
            connect: listing.features.map((f) => ({ id: f.id })),
          },
          amenities: {
            connect: listing.amenities.map((a) => ({ id: a.id })),
          },
          contactId: listing.contactId,
          publisherId: listing.publisherId,
          trakheesi: listing.trakheesi,
          propertyStatus: listing.propertyStatus,
          serviceCharge: listing.serviceCharge,
          pricePerSqft: listing.pricePerSqft,
          rentalPrice: null,
          rentedFrom: listing.rentedFrom,
          rentedUntil: listing.rentedUntil,
          rentedPrice: listing.rentedPrice,
          rentedCheques: listing.rentedCheques,
          tenant: listing.tenant,
          status: listing.status,
          categoryId: listing.categoryId,
          rentalCheques: null,
          rentalLeaseTerm: null,
          rentalAvailableFrom: null,
          str: listing.str,
          photoshootId: listing.photoshootId,
          expiresAt: listing.expiresAt,
          publishedAt: listing.publishedAt,
          deletedAt: listing.deletedAt,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          agentId: listing.agentId,
          assigneeId: listing.assigneeId,
        },
      });
      return [listing.id, newListing.id];
    }
    return [listing.id];
  });
};

export default {
  findAll,
  findOne,
  create,
  update,
  destroy,
  count,
  publish,
  republish,
  handleSplitListing,
  archive,
};
