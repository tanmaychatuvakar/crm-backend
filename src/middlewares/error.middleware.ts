import { HttpException } from "@/exceptions/http/http.exception";
import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

const error = (
  err: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line
) => {
  const response: Record<string, any> = {
    statusCode: 500,
    message: "Something went wrong",
    data: null,
  };

  if (err instanceof HttpException) {
    response.statusCode = err.status;
    response.message = err.message;
    response.data = err.data;
  }

  logger.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${response.statusCode}, Message:: ${response.message} ${err.message} ${err}`
  );

  res.status(response.statusCode).json(response);
};

export default error;
