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

  getRoutes() {}

  postRoutes() {
    this.router.post(
      "/signup",
      UserValidators.validateUserSignup(),
      GlobalMiddleware.checkError,
      UserController.signup
    );
  }

  patchRoutes() {
    this.router.post(
      "/verify",
      UserValidators.verifyUserEmail(),
      GlobalMiddleware.checkError,
      UserController.verify
    );
  }

  putRoutes() {}

  deleteRoutes() {}
}

export default new UserRouter().router;
