import client from "@/db/client";
import { FurnishedStatus, PropertyStatus } from "@prisma/client";
import convert from "xml-js";
import { formatInTimeZone } from "date-fns-tz";

const dateTimeFormat = "yyyy-MM-ddHH:mm:ss";

const helpers = {
  formatType: (commercial: boolean, sale: boolean) =>
    `${commercial ? "C" : "R"}${sale ? "S" : "R"}`,
  formatFurnished: (furnished: FurnishedStatus | null) => {
    if (!furnished) {
      return "";
    }
    switch (furnished) {
      case "NO":
        return "No";
      case "PARTLY":
        return "Partly";
      case "YES":
        return "Yes";
    }
  },
  formatCompletionStatus: (status: PropertyStatus | null) => {
    if (!status) {
      return "";
    }
    switch (status) {
      case "COMPLETED":
      case "COMPLETED_SECONDARY":
        return "completed";
      case "OFFPLAN_SECONDARY":
      case "UNDER_CONSTRUCTION":
        return "off_plan";
      case "COMPLETED_PRIMARY":
        return "completed_primary";
      case "OFFPLAN_PRIMARY":
        return "off_plan_primary";
    }
  },
};

const getFeed = async () => {
  const listings = await client.listing.findMany({
    where: {
      publishedAt: {
        not: null,
      },
    },
    include: {
      agent: true,
      amenities: true,
      city: true,
      community: true,
      subcommunity: true,
      property: true,
      category: true,
      photoshoot: { include: { editorImages: true } },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const json = {
    _declaration: {
      _attributes: {
        version: "1.0",
        encoding: "utf-8",
      },
    },
    list: {
      _attributes: {
        last_update: listings.length
          ? formatInTimeZone(
              listings[0].updatedAt,
              "Asia/Dubai",
              dateTimeFormat
            )
          : "",
        listing_count: listings.length,
      },
      property: listings.map((listing) => ({
        _attributes: {
          last_update: formatInTimeZone(
            listing.updatedAt,
            "Asia/Dubai",
            dateTimeFormat
          ),
        },
        reference_number: listing.reference,
        permit_number: listing.trakheesi,
        offering_type: helpers.formatType(listing.isCommercial, listing.isSale),
        property_type: listing.category ? listing.category.code : "",
        // price_on_application: listing.askForPrice,
        // price: {},
        service_charge: listing.serviceCharge,
        cheques: listing.rentalCheques, // Todo: check here!
        city: listing.city ? listing.city.name : "",
        community: listing.community ? listing.community.name : "",
        sub_community: listing.subcommunity ? listing.subcommunity.name : "",
        property_name: listing.property ? listing.property.name : "",
        title_en: listing.title,
        description_en: {
          _cdata: listing.description,
        },
        private_amenities: listing.amenities
          .filter((a) => a.private)
          .map((a) => a.code)
          .join(","),
        commercial_amenities: listing.amenities
          .filter((a) => a.commercial)
          .map((a) => a.code)
          .join(","),
        plot_size: listing.plotArea ?? "",
        size: listing.totalArea ?? 0,
        bedroom: listing.numberOfBedrooms,
        bathroom: listing.numberOfBathrooms,
        agent: {
          id: listing.agent?.id,
          name: listing.agent?.name,
          email: listing.agent?.email,
          phone: listing.agent?.phoneNumber,
          photo: listing.agent?.profileImage,
          license_no: "",
          info: "",
        },
        build_year: "",
        floor: listing.floor, // Todo: should be number
        stories: "",
        parking: listing.parking ?? "",
        furnished: helpers.formatFurnished(listing.furnished),
        view360: "",
        photo: listing.photoshoot?.editorImages.map((image) => ({
          url: {
            _text: image.objectKey,
            _attributes: {
              last_updated: formatInTimeZone(
                image.updatedAt,
                "Asia/Dubai",
                dateTimeFormat
              ),
            },
          },
        })),
        floor_plan: [],
        geopoints: "",
        title_deed: "",
        availability_date: listing.rentalAvailableFrom
          ? listing.rentalAvailableFrom
          : "",
        video_tour_url: "",
        developer: "",
        project_name: "",
        completion_status: helpers.formatCompletionStatus(
          listing.propertyStatus
        ), //Todo: in PF docs, it shows "and" which is not the case inside the db
      })),
    },
  };

  return convert.js2xml(json, { compact: true });
};

export default {
  getFeed,
};
