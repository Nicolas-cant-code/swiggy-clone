import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";

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
  }

  postRoutes() {
    this.router.post(
      "/signup",
      UserValidators.validateUserSignup(),
      GlobalMiddleware.checkError,
      UserController.signup
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
      "/verify",
      UserValidators.verifyUser(),
      GlobalMiddleware.checkError,
      GlobalMiddleware.auth,
      UserController.verify
    );
  }

  putRoutes() {}

  deleteRoutes() {}
}

export default new UserRouter().router;
