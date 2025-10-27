import { Request, Response } from "express";
import authenticationService from "./authentication.service";
import { JWT_ACCESS_TOKEN_TTL, NODE_ENV } from "@/config";

const cookieOptions = {
  secure: NODE_ENV !== "local",
  domain:
    NODE_ENV !== "local" ? ".dev.eu-central-1.dubaiplatform.net" : undefined,
};

async function signIn(req: Request, res: Response) {
  const data = await authenticationService.signIn(req.body);
  res.cookie("token", data.token, {
    ...cookieOptions,
    maxAge: JWT_ACCESS_TOKEN_TTL * 1000,
  });
  res.json({ token: data.token });
}

async function logout(req: Request, res: Response) {
  res.clearCookie("token", cookieOptions);
  res.sendStatus(204);
}

export default {
  signIn,
  logout,
};
