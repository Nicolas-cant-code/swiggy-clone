import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { ResterauntController } from "../controllers/ResterauntController";
import { ResterauntValidators } from "../validators/RestarauntValidators";
import { Utils } from "../utils/Utils";

class ResterauntRouter {
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
      "/nearbyResteraunts",
      GlobalMiddleware.auth,
      ResterauntValidators.getNearbyResteraunts(),
      GlobalMiddleware.checkError,
      ResterauntController.getNearbyResteraunts
    );
    this.router.get(
      "/searchNearbyResteraunts",
      GlobalMiddleware.auth,
      ResterauntValidators.searchNearbyResteraunts(),
      GlobalMiddleware.checkError,
      ResterauntController.searchNearbyResteraunts
    );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      GlobalMiddleware.adminRole,
      new Utils().multer.single("resterauntImages"),
      ResterauntValidators.addResteraunt(),
      GlobalMiddleware.checkError,
      ResterauntController.addResteraunt
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new ResterauntRouter().router;
