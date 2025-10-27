import { Request, Response } from "express";

const upload = async (req: Request, res: Response) => {
  const { location, originalname } = req.file as Express.MulterS3.File;
  res.send({
    fileName: originalname,
    path: location,
  });
};

export default { upload };
