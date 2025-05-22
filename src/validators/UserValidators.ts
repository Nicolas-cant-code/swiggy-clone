import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidators {
  static validateUserSignup() {
    return [
      body("name", "Name is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email, type: "user" })
            .then((user) => {
              if (user) {
                throw "Email already in use";
              } else {
                return true;
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      body("password", "Password is required")
        .isAlphanumeric()
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be between 6 and 20 characters"),
      body("type", "Type is required").isString(),
      body("phone", "Phone is required").isString(),
      body("status", "Status is required").isString(),
    ];
  }

  static verifyUserEmail() {
    return [
      body(
        "verification_token",
        "Email verification token is required"
      ).isNumeric(),
      body("email", "Email is required").isEmail(),
    ];
  }

  static resendVerificationEmail() {
    return [query("email", "Email is required").isEmail()];
  }
}
