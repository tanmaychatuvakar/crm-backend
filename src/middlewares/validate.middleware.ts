import { NextFunction, Request, Response } from "express";

import { ZodIssue, ZodSchema } from "zod";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { UnprocessableContentException } from "@/exceptions/http/unprocessable-content.exception";

type Path = "body" | "query";

const prettify = (issues: ZodIssue[]) =>
  issues.map((issue) => ({
    path: issue.path[0],
    error: issue.message,
  }));

const build = (path: Path, schema: ZodSchema, whitelist?: boolean) => {
  return async function <
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query,
  >(
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) {
    const parsed = await schema.safeParseAsync(req[path]);
    console.log(parsed.error);

    if (!parsed.success) {
      const errors = prettify(parsed.error.issues);
      throw new UnprocessableContentException("Validation Error", errors);
    }

    const value = whitelist ? parsed.data : req[path];
    Object.defineProperty(req, path, { value });

    next();
  };
};

const validate = {
  body: (schema: ZodSchema, whitelist = true) =>
    build("body", schema, whitelist),
  query: (schema: ZodSchema, whitelist = true) =>
    build("query", schema, whitelist),
};

export default validate;
