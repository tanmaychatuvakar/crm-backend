import { z } from "zod";
import updatePasswordSchema from "./schemas/update-password.schema";
import usersService from "@/modules/users/users.service";
import hashingService from "../hashing.service";
import { UnauthorizedException } from "@/exceptions/http/unauthorized.exception";
import updateProfileSchema from "./schemas/update.schema";
import { Prisma, User } from "@prisma/client";

const updatePassword = async (
  userId: string,
  data: z.infer<typeof updatePasswordSchema>
) => {
  const { currentPassword, newPassword } = data;
  const user = await usersService.findOne({
    where: { id: userId },
    omit: { password: false },
  });

  const match = await hashingService.compare(
    currentPassword,
    (user as User).password
  );
  if (!match) {
    throw new UnauthorizedException();
  }

  const password = await hashingService.hash(newPassword);

  return await usersService.update({
    where: { id: userId },
    data: {
      password,
    },
  });
};

const getProfile = async (userId: string) => {
  return await usersService.findOne({
    where: { id: userId },
  });
};

const update = async (
  userId: string,
  body: z.infer<typeof updateProfileSchema>
) => {
  return await usersService.update({
    where: { id: userId },
    data: {
      name: body.name,
      phoneNumber: body.phoneNumber,
    },
  });
};

const updateImage = async (userId: string, location: string) => {
  return await usersService.update({
    where: { id: userId },
    data: {
      profileImage: location,
    },
  });
};

export default {
  getProfile,
  updatePassword,
  update,
  updateImage,
};
