import { extname } from "node:path";
import { randomUUID } from "node:crypto";

export const parseIncludes = (include: any) =>
  typeof include === "string" ? include.split(",") : [];

export const formatFilename = (fileName: string, path?: string) => {
  const newFileName =
    randomUUID() + "-" + Date.now().toString() + extname(fileName);
  if (path) {
    return `${path}/${newFileName}`;
  }
  return newFileName;
};
