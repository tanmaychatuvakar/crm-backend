import {
  FittedStatus,
  FurnishedStatus,
  LeaseTerm,
  PropertyStatus,
} from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  isRental: z.boolean(),
  isSale: z.boolean(),
  isRented: z.boolean(),

  title: z.string().min(1, '"Title" is required'),
  categoryId: z.string().uuid().nullable(),
  totalArea: z
    .number()
    .int()
    .max(2147483647, "Max area allowed is 2147483647")
    .nullable(),
  plotArea: z
    .number()
    .int()
    .max(2147483647, "Max area allowed is 2147483647")
    .nullable(),
  numberOfBedrooms: z.number().int().nullable(),
  numberOfBathrooms: z.number().int().nullable(),
  furnished: z.nativeEnum(FurnishedStatus).nullable(),
  appliances: z.boolean(),
  parking: z.number().int().max(99, "Max parkings allowed is 99").nullable(),
  propertyStatus: z.nativeEnum(PropertyStatus).nullable(),
  // .superRefine((val, ctx) => {
  //   if (ctx.parent.isSale && val === undefined) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: '"Property Status" is required when "isSale" is true',
  //       path: ["propertyStatus"],
  //     });
  //   }
  // }),
  // Location step
  cityId: z.string().uuid().nullable(),
  communityId: z.string().uuid().nullable(),
  subcommunityId: z.string().uuid().nullable(),
  propertyId: z.string().uuid().nullable(),

  unitNumber: z.string().nullable(),
  streetNumber: z.string().nullable(),
  floor: z.number().nullable(),
  view: z.string().nullable(),

  // Pricing step
  salePrice: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .nullable(),
  // .superRefine((val, ctx) => {
  //   if (ctx.parent.isSale && val === undefined) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: '"Sale Price" is required when "isSale" is true',
  //       path: ["salePrice"],
  //     });
  //   }
  // }),
  pricePerSqft: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .nullable(),

  features: z.array(z.string()),

  amenities: z.array(z.string()),

  // Rented Step
  rentedFrom: z.coerce.date().nullable(),
  rentedUntil: z.coerce.date().nullable(),
  // .superRefine((val, ctx) => {
  //   if (ctx.parent.rentedFrom && val && val < ctx.parent.rentedFrom) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: '"Rented Until" must be greater than "Rented From"',
  //       path: ["rentedUntil"],
  //     });
  //   }
  // }),
  rentedPrice: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .nullable(),
  rentedCheques: z.number().int().nullable(),
  tenant: z.string().nullable(),

  // General Step
  contactId: z.string().uuid().nullable(),
  sourceId: z.string().uuid().nullable(),
  isExclusive: z.boolean(),
  isCommercial: z.boolean(),
  fitted: z.nativeEnum(FittedStatus).nullable(),
  str: z.string().nullable(),

  // Documents Step

  // Rental Step
  rentalPrice: z
    .number()
    .int()
    .max(2147483647, "Max price allowed is 2147483647")
    .nullable(),
  // .superRefine((val, ctx) => {
  //   if (ctx.parent.isRental && val === undefined) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: '"Rental Price" is required when "isRental" is true',
  //       path: ["rentalPrice"],
  //     });
  //   }
  // }),
  rentalCheques: z.number().int().nullable(),
  // .superRefine((val, ctx) => {
  //   if (ctx.parent.isRental && val === undefined) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: '"Rental Cheques" are required when "isRental" is true',
  //       path: ["rentalCheques"],
  //     });
  //   }
  // }),
  rentalLeaseTerm: z.nativeEnum(LeaseTerm).nullable(),
  // .superRefine((val, ctx) => {
  //   if (ctx.parent.isRental && val === undefined) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: '"Rental Lease Term" is required when "isRental" is true',
  //       path: ["rentalLeaseTerm"],
  //     });
  //   }
  // }),
  rentalAvailableFrom: z.coerce.date().nullable(),
  serviceCharge: z
    .number()
    .int()
    .max(2147483647, "Max value allowed is 2147483647")
    .nullable(),

  // Description Step
  description: z.string().nullable(),

  // Not available as input field inside the create listing form
  // Useless but I will leave them for you to review
  isHalfBath: z.boolean(),
  isPrimary: z.boolean(),
  askForPrice: z.boolean(),
  // type: z.string().nullable().default(""),

  // .superRefine((val, ctx) => {
  //   if (
  //     ctx.parent.rentalAvailableFrom &&
  //     val &&
  //     val < ctx.parent.rentalAvailableFrom
  //   ) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message:
  //         '"Contract End Date" must be greater than "Rental Available From"',
  //       path: ["contractEndDate"],
  //     });
  //   }
  // }),

  brokerContractRentalDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  brokerContractSaleDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  titleDeedDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  poaDocument: z.object({ fileName: z.string(), path: z.string() }).nullable(),
  ownerIdDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
  otherDocument: z
    .object({ fileName: z.string(), path: z.string() })
    .nullable(),
});

export default schema;
