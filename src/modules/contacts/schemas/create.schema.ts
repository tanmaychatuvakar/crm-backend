import z from 'zod';

const schema = z
  .object({
    title: z.enum(['Mr.', 'Mrs.']),
    name: z.string(),
    mobileCountryCode: z.string(),

    mobileNumber: z.string().regex(/^\d+$/),

    phoneCountryCode: z.string().nullable(),
    phoneNumber: z.string().nullable(),

    email: z.string().email(),
    nationalityId: z.string().uuid(),
    dateOfBirth: z.coerce.date(),

    emiratesId: z.string().nullable(),
    passportNumber: z.string(),
    spokenLanguage: z.string().nullable(),
    contactType: z.enum(['COMPANY', 'INDIVIDUAL']),
  })
  .superRefine((data, ctx) => {
    if (data.phoneCountryCode !== null) {
      if (data.phoneNumber === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone Number is required',
          path: ['phoneNumber'],
        });
      }
    }
  });

export default schema;
