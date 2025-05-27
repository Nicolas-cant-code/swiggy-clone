import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { BannerValidators } from "../validators/BannerValidators";
import { BannerController } from "../controllers/BannerController";
import { Utils } from "../utils/Utils";

class BannerRouter {
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
      "/banners",
      GlobalMiddleware.auth,
      BannerController.getBanners
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      GlobalMiddleware.adminRole,
      new Utils().multer.single("banner"),
      BannerValidators.createBanner(),
      GlobalMiddleware.checkError,
      BannerController.createBanner
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new BannerRouter().router;
