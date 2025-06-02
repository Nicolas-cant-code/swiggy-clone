import { Utils } from "../utils/Utils";
import { Environment } from "./environment";

Utils.dotenvConfig();

export const ProdEnvironment: Environment = {
  db_url: process.env.PROD_DB_URL,

  jwt_secret_key: process.env.PROD_JWT_SECRET_KEY,
  jwt_refresh_secret_key: process.env.PROD_JWT_REFRESH_SECRET_KEY,

  sendgrid: {
    api_key: process.env.PROD_SENDGRID_API_KEY,
    email_from: process.env.PROD_EMAIL_FROM,
  },
  gmail_auth: {
    user: process.env.PROD_GMAIL_AUTH_USER,
    pass: process.env.PROD_GMAIL_AUTH_PASS,
  },
};
