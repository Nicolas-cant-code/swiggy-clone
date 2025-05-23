import { Environment } from "./environment";

export const ProdEnvironment: Environment = {
  db_url:
    "mongodb+srv://nicw103:17Ants17@zaioappclone.jakbqev.mongodb.net/zaioAppClone",
  jwt_secret_key: "secret_key_production",
  sendgrid: {
    api_key:
      "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",
    email_from: "nicw103@gmail.com",
  },
  gmail_auth: {
    user: "",
    pass: "",
  },
};
