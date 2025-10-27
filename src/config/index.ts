import { config } from "dotenv";
import { cleanEnv, str, num, bool, url, port } from "envalid";

config();

const defaultUrl = "http://localhost:3000";

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "testing", "production", "staging", "local"],
  }),
  BASE_URI: url({ default: defaultUrl }),
  PORT: port({ default: 3000 }),
  LOG_FORMAT: str({ devDefault: "dev" }),
  LOG_DIR: str({ default: "logs" }),
  ORIGIN: str({ devDefault: "*" }),
  CREDENTIALS: bool({ default: true }),

  REGION: str({ devDefault: "us-west-2" }),
  S3_BUCKET: str(),
  ACCESS_KEY_ID: str({ default: "" }),
  SECRET_ACCESS_KEY: str({ default: "" }),

  DB_ADDRESS: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_PORT: port(),
  DB_USER: str(),

  JWT_SECRET: str(),
  JWT_AUDIENCE: str({ devDefault: defaultUrl }),
  JWT_TOKEN_ISSUER: str({ devDefault: defaultUrl }),
  JWT_ACCESS_TOKEN_TTL: num({ devDefault: 3600 }),
});

export const {
  BASE_URI,
  PORT,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  CREDENTIALS,
  REGION,
  S3_BUCKET,
  JWT_SECRET,
  JWT_AUDIENCE,
  JWT_TOKEN_ISSUER,
  JWT_ACCESS_TOKEN_TTL,
  NODE_ENV,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  DB_ADDRESS,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} = env;
