import { Request, Response } from "express";
import feedbackService from "./feedback.service";

const update = async (req: Request, res: Response) => {
  const result = await feedbackService.update(req.params.id, req.body);
  res.send(result);
};

export default {
  update,
};
