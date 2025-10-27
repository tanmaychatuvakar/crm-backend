import client from '@/db/client';
import { z } from 'zod';
import createContactSchema from './schemas/create.schema';
import { Prisma } from '@prisma/client';

const findAll = async (args?: Prisma.ContactFindManyArgs) => {
  return await client.contact.findMany(args);
};

const create = (userId: string, data: z.infer<typeof createContactSchema>) => {
  return client.contact.create({
    data: {
      emiratesId: data.emiratesId,
      contactType: data.contactType,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      mobileCountryCode: data.mobileCountryCode,
      mobileNumber: data.mobileNumber,
      phoneCountryCode: data.phoneCountryCode,
      phoneNumber: data.phoneNumber,
      spokenLanguage: data.spokenLanguage,
      name: data.name,
      passportNumber: data.passportNumber,
      title: data.title,
      nationality: {
        connect: {
          id: data.nationalityId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export default {
  findAll,
  create,
};
