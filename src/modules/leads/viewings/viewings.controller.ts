import { Request, Response } from "express";
import viewingsService from "./viewings.service";

const create = async (req: Request, res: Response) => {
  const result = await viewingsService.create(
    req.user.id,
    req.params.id,
    req.body
  );
  res.status(201).send(result);
};

export default { create };
