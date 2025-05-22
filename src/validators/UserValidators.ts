import { body } from "express-validator";

export class UserValidators {
  static validateUserSignup() {
    return [
      body("name", "Name is required").isString(),
      body("email", "Email is required").isEmail(),
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
}
