import { Request, Response } from "express";
import profileService from "./profile.service";

const updatePassword = async (req: Request, res: Response) => {
  await profileService.updatePassword(req.user.id, req.body);
  res.sendStatus(200);
};

const getProfile = async (req: Request, res: Response) => {
  const result = await profileService.getProfile(req.user.id);
  res.send(result);
};

const update = async (req: Request, res: Response) => {
  const result = await profileService.update(req.user.id, req.body);
  res.send(result);
};

const updateImage = async (req: Request, res: Response) => {
  const { location } = req.file as Express.MulterS3.File;
  const result = await profileService.updateImage(req.user.id, location);
  res.send(result);
};

export default {
  updatePassword,
  getProfile,
  update,
  updateImage,
};
