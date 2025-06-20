import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { Utils } from "../utils/Utils";

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get(
      "/send/verification/email",
      GlobalMiddleware.auth,
      UserController.resendVerificationEmail
    );
    this.router.get(
      "/login",
      UserValidators.login(),
      GlobalMiddleware.checkError,
      UserController.login
    );
    this.router.get(
      "/send/reset/password/token",
      UserValidators.checkResetPassword(),
      GlobalMiddleware.checkError,
      UserController.sendResetPassword
    );
    this.router.get(
      "/reset/passwordToken",
      UserValidators.checkResetPasswordToken(),
      GlobalMiddleware.checkError,
      UserController.sendResetPasswordToken
    );
    this.router.get("/profile", GlobalMiddleware.auth, UserController.profile);
  }

  postRoutes() {
    this.router.post(
      "/signup",
      UserValidators.validateUserSignup(),
      GlobalMiddleware.checkError,
      UserController.signup
    );
    this.router.post(
      "/refresh/token",
      GlobalMiddleware.decodeRefreshToken,
      GlobalMiddleware.checkError,
      UserController.checkRefreshToken
    );
    this.router.post(
      "/logout",
      GlobalMiddleware.auth,
      GlobalMiddleware.decodeRefreshToken,
      UserController.logout
    );
  }

  patchRoutes() {
    this.router.patch(
      "/reset/password",
      UserValidators.resetPassword(),
      GlobalMiddleware.checkError,
      UserController.resetPassword
    );
    this.router.patch(
      "/verify/emailOTP",
      GlobalMiddleware.auth,
      UserValidators.verifyUserEmailOTP(),
      GlobalMiddleware.checkError,
      UserController.verifyUserEmailOTP
    );
    this.router.patch(
      "/update/phone",
      GlobalMiddleware.auth,
      UserValidators.verifyPhone(),
      GlobalMiddleware.checkError,
      UserController.updatePhone
    );
    this.router.patch(
      "/update/profile",
      GlobalMiddleware.auth,
      UserValidators.verifyUserProfile(),
      GlobalMiddleware.checkError,
      UserController.updateUserProfile
    );
  }

  putRoutes() {
    this.router.put(
      "/update/profilePic",
      GlobalMiddleware.auth,
      new Utils().multer.single("profileImages"),
      UserValidators.userProfilePic(),
      GlobalMiddleware.checkError,
      UserController.updateUserProfilePic
    );
  }

  deleteRoutes() {}
}

export default new UserRouter().router;
