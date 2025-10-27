import { Request, Response } from "express";
import qualificationsService from "./qualifications.service";

const update = async (req: Request, res: Response) => {
  const result = await qualificationsService.update(req.params.id, req.body);
  res.send(result);
};

export default { update };
