import { Utils } from "../utils/Utils";
import { Environment } from "./environment";

Utils.dotenvConfig();

export const DevEnvironment: Environment = {
  db_url: process.env.DEV_DB_URL,

  jwt_secret_key: process.env.DEV_JWT_SECRET_KEY,
  jwt_refresh_secret_key: process.env.DEV_JWT_REFRESH_SECRET_KEY,

  sendgrid: {
    api_key: process.env.DEV_SENDGRID_API_KEY,
    email_from: process.env.DEV_EMAIL_FROM,
  },

  gmail_auth: {
    user: process.env.DEV_GMAIL_AUTH_USER,
    pass: process.env.DEV_GMAIL_AUTH_PASS,
  },
};
