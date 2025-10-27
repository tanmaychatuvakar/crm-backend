import prismaClient from "@/db/client";
import {
  bedrooms,
  bathrooms,
  furnished,
  cheques,
  fitted,
  appliances,
  propertyStatus,
  leaseTerm,
  countryCodes,
  contactTypes,
  PhotoshootStatus,
} from "../../constants/dashboard";

async function getCommon() {
  const [
    categories,
    locations,
    sources,
    features,
    amenities,
    nationalities,
    roles,
  ] = await Promise.all([
    prismaClient.$queryRawUnsafe(buildQuery("category")),
    prismaClient.$queryRawUnsafe(buildQuery("city")),
    prismaClient.$queryRawUnsafe(buildQuery("source")),
    prismaClient.feature.findMany({ select: { id: true, name: true } }),
    prismaClient.amenity.findMany({ select: { id: true, name: true } }),
    prismaClient.$queryRawUnsafe(
      `SELECT id AS value, name AS label FROM "public"."nationality" ORDER BY name ASC`
    ),
    prismaClient.reason.findMany({
      select: { id: true, reason: true, intent: true },
    }),
  ]);

  return {
    bedrooms,
    bathrooms,
    furnished,
    cheques,
    categories,
    locations,
    sources,
    features,
    amenities,
    nationalities,
    fitted,
    appliances,
    propertyStatus,
    leaseTerm,
    countryCodes,
    contactTypes,
    PhotoshootStatus,
    roles,
  };
}

const buildQuery = (tableName: string, selectRaw?: string) => {
  if (selectRaw) {
    return `SELECT id AS value, name AS label, ${selectRaw} FROM "public"."${tableName}"`;
  }
  return `SELECT id AS value, name AS label FROM "public"."${tableName}"`;
};

export default {
  getCommon,
};
