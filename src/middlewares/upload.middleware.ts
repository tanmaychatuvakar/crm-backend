import { S3_BUCKET } from "@/config";
import { formatFilename } from "@/utils";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client();

type Options = {
  key?(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: any, key?: string) => void
  ): void;
  acl?:
    | ((
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: any, acl?: string) => void
      ) => void)
    | string
    | undefined;
  contentType?(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (
      error: any,
      mime?: string,
      stream?: NodeJS.ReadableStream
    ) => void
  ): void;
  contentDisposition?:
    | ((
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: any, contentDisposition?: string) => void
      ) => void)
    | string
    | undefined;
};

const upload = (path?: string, options?: Options) => {
  return multer({
    storage: multerS3({
      s3,
      bucket: S3_BUCKET,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, formatFilename(file.originalname, path));
      },
      ...options,
    }),
  });
};

export default upload;
