import client from "@/db/client";
import { z } from "zod";
import createUserSchema from "./schemas/create.schema";
import { Prisma, Role } from "@prisma/client";
import hashingService from "../iam/hashing.service";
import { NotFoundException } from "@/exceptions/http/not-found.exception";
import { BadRequestException } from "@/exceptions/http/bad-request.exception";

const findOne = async (args: Prisma.UserFindUniqueOrThrowArgs) => {
  return await client.user.findUniqueOrThrow(args);
};

const findAll = async (args?: Prisma.UserFindManyArgs) => {
  return await client.user.findMany(args);
};

const create = async (data: z.infer<typeof createUserSchema>) => {
  const password = await hashingService.hash(data.password);
  return await client.user.create({
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      phoneNumberCountryCode: data.phoneNumberCountryCode,
      password,
      role: data.role,
    },
  });
};

const update = async (args: Prisma.UserUpdateArgs) => {
  return await client.user.update(args);
};

const destroy = async (userId: string) => {
  const user = await client.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException();
  }

  if (user.role === "ADMINISTRATOR") {
    throw new BadRequestException();
  }

  return client.user.update({
    where: { id: user.id },
    data: {
      deletedAt: new Date(),
    },
  });
};

const count = async (args: Prisma.UserCountArgs) => {
  return await client.user.count(args);
};

const hold = async (userId: string) => {
  const user = await client.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.role === Role.ADMINISTRATOR) {
    throw new BadRequestException("administrator cannot be put on hold");
  }

  return await client.user.update({
    where: { id: userId },
    data: {
      heldAt: user.heldAt ? null : new Date(),
    },
  });
};

export default {
  findOne,
  findAll,
  create,
  destroy,
  count,
  update,
  hold,
};
