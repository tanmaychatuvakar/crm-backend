import { UnauthorizedException } from "@/exceptions/http/unauthorized.exception";
import usersService from "@/modules/users/users.service";
import {
  JWT_SECRET,
  JWT_ACCESS_TOKEN_TTL,
  JWT_AUDIENCE,
  JWT_TOKEN_ISSUER,
} from "@config";
import hashingService from "../hashing.service";
import jwtService from "../jwt.service";
import { z } from "zod";
import signInSchema from "./schemas/sign-in.schema";
import { Prisma, User } from "@prisma/client";

async function signIn(data: z.infer<typeof signInSchema>) {
  const { email, password } = data;
  try {
    const user = await usersService.findOne({
      where: {
        email,
        heldAt: null,
      },
      omit: { password: false },
    });

    const valid = await hashingService.compare(
      password,
      (user as User).password
    );
    if (!valid) throw new Error();

    return generateTokens(user as User);
  } catch {
    throw new UnauthorizedException();
  }
}

async function generateTokens(user: User) {
  const token = await signToken<Partial<{ email: string; role: string }>>(
    user.id,
    JWT_ACCESS_TOKEN_TTL,
    {
      email: user.email,
      role: user.role,
    }
  );

  return { token };
}

async function signToken<T>(userId: string, expiresIn: number, payload?: T) {
  return jwtService.sign(
    {
      sub: userId,
      aud: JWT_AUDIENCE,
      iss: JWT_TOKEN_ISSUER,
      ...payload,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

export default {
  signIn,
};
