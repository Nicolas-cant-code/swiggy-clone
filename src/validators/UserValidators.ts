import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidators {
  static validateUserSignup() {
    return [
      body("name", "Name is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email })
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

  static verifyUserEmailOTP() {
    return [
      body(
        "verification_token",
        "Email verification token is required"
      ).isNumeric(),
    ];
  }
  static login() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email })
            .then((user) => {
              if (user) {
                if (user.type == "user" || user.type == "admin") {
                  req.user = user;
                  return true;
                } else {
                  throw "You are not an authorized user";
                }
              } else {
                throw "User doesn't exist";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      query("password", "Password is required").isAlphanumeric(),
    ];
  }

  static checkResetPassword() {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email: email })
            .then((user) => {
              if (user) {
                return true;
              } else {
                throw "User doesn't exist";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
    ];
  }

  static checkResetPasswordToken() {
    return [
      query("email", "Email is required").isEmail(),
      query("reset_password_token", "Reset password token is required")
        .isNumeric()
        .custom((token, { req }) => {
          return User.findOne({
            email: req.query.email,
            reset_password_verification_token: token,
            reset_password_verification_token_time: {
              $gt: Date.now(),
            },
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                throw "Reset password token is invalid or expired";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
    ];
  }

  static resetPassword() {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                throw "No User found with this email";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      body("new_password", "New password is required")
        .isAlphanumeric()
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be between 6 and 20 characters"),
      body("otp", "Reset password token is required")
        .isNumeric()
        .custom((reset_password_token, { req }) => {
          if (req.user.reset_password_token == reset_password_token) {
            return true;
          } else {
            req.errorStatus = 422;
            throw new Error("Reset password token is invalid");
          }
        }),
    ];
  }

  static verifyPhone() {
    return [body("phone", "Phone number is required").isString()];
  }

  static verifyUserProfile() {
    return [
      body("phone", "Phone number is required").isString(),
      body("new_email", "Email is required")
        .isEmail()
        .custom((new_email, { req }) => {
          if (req.user.email === new_email) {
            throw "Please use a new unique email address.";
          }
          return User.findOne({
            email: new_email,
          })
            .then((user) => {
              if (user) {
                throw "User with this email already exists";
              } else {
                return true;
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      body("password", "Password is required").isAlphanumeric(),
    ];
  }

  // static checkRefreshToken() {
  //   return [
  //     body("refresh_token", "Refresh token is required")
  //       .isString()
  //       .custom((refresh_token, { req }) => {
  //         if (refresh_token) {
  //           return true;
  //         } else {
  //           req.errorStatus = 403;
  //           throw "Access is Forbiden";
  //         }
  //       }),
  //   ];
  // }

  static userProfilePic() {
    return [
      body("profileImages", "Profile image is required").custom(
        (profileImage, { req }) => {
          if (req.file) {
            return true;
          } else {
            throw new Error("Profile image not uploaded");
          }
        }
      ),
    ];
  }
}
