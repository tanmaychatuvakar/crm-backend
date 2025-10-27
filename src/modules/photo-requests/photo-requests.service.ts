import client from '@/db/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import createPhotoRequestSchema from './schemas/create.schema';
import rejectPhotoRequestSchema from './schemas/reject.schema';

const findOne = async (args: Prisma.PhotoRequestFindFirstArgs) => {
  return await client.photoRequest.findFirst(args);
};

const findAll = async (args?: Prisma.PhotoRequestFindManyArgs) => {
  return await client.photoRequest.findMany(args);
};

const create = async (data: z.infer<typeof createPhotoRequestSchema>) => {
  return await client.$transaction(async tx => {
    const count = await tx.photoRequest.count({ where: { listingId: data.listingId, status: 'PENDING' } });
    if (count > 0) {
      throw new Error();
    }

    await tx.listing.update({
      where: { id: data.listingId },
      data: {
        status: 'PHOTO_REQUEST',
      },
    });
    return tx.photoRequest.create({ data });
  });
};

const update = async (args: Prisma.PhotoRequestUpdateArgs) => {
  return await client.photoRequest.update(args);
};

const count = async (args: Prisma.PhotoRequestCountArgs) => {
  return await client.photoRequest.count(args);
};

const approve = async (photoRequestId: string) => {
  return await client.$transaction(async tx => {
    const photoRequest = await tx.photoRequest.update({ where: { id: photoRequestId }, data: { status: 'APPROVED' } });
    await tx.photoshoot.create({
      data: {
        photoRequestId: photoRequest.id,
        listings: {
          connect: [{ id: photoRequest.listingId }],
        },
      },
    });
    return photoRequest;
  });
};

const cancel = async (photoRequestId: string) => {
  return await client.$transaction(async tx => {
    const photoRequest = await tx.photoRequest.update({
      where: {
        id: photoRequestId,
      },
      data: {
        status: 'CANCELED',
      },
    });
    await tx.listing.update({ where: { id: photoRequest.listingId }, data: { status: 'DRAFT' } });
    return photoRequest;
  });
};

const reject = async (photoRequestId: string, data: z.infer<typeof rejectPhotoRequestSchema>) => {
  return await client.$transaction(async tx => {
    const photoRequest = await tx.photoRequest.update({
      where: {
        id: photoRequestId,
      },
      data: {
        status: 'REJECTED',
        rejectionReason: data.rejectionReason,
      },
    });
    await tx.listing.update({ where: { id: photoRequest.listingId }, data: { status: 'DRAFT' } });
    return photoRequest;
  });
};

export default {
  findAll,
  findOne,
  create,
  update,
  count,
  approve,
  cancel,
  reject,
};
