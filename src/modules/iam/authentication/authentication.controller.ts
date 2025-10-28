import { Request, Response } from "express";
import authenticationService from "./authentication.service";

async function signIn(req: Request, res: Response) {
  const data = await authenticationService.signIn(req.body);
  res.json({ token: data.token });
}

async function logout(req: Request, res: Response) {
  res.sendStatus(204);
}

export default {
  signIn,
  logout,
};
