import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { AddressController } from "../controllers/AddressController";
import { AddressValidators } from "../validators/AddressValidators";

class AddressRouter {
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
      "/addresses",
      GlobalMiddleware.auth,
      AddressController.getAddresses
    );
    this.router.get(
      "/check/addresses",
      GlobalMiddleware.auth,
      AddressValidators.checkAddress(),
      GlobalMiddleware.checkError,
      AddressController.checkAddress
    );
    this.router.get(
      "/get/limited/addresses",
      GlobalMiddleware.auth,
      AddressValidators.getLimitedAddresses(),
      GlobalMiddleware.checkError,
      AddressController.getLimitedAddresses
    );
    // this.router.get(
    //   "/:id",
    //   GlobalMiddleware.auth,
    //   AddressController.getAddressesById
    // );
  }

  postRoutes() {
    this.router.post(
      "/create",
      GlobalMiddleware.auth,
      AddressValidators.addAddress(),
      GlobalMiddleware.checkError,
      AddressController.addAddress
    );
  }

  patchRoutes() {
    // this.router.patch(
    //   "/edit/:id",
    //   GlobalMiddleware.auth,
    //   AddressValidators.editAddress(),
    //   GlobalMiddleware.checkError,
    //   AddressController.editAddress
    // );
  }

  putRoutes() {
    this.router.put(
      "/edit/:id",
      GlobalMiddleware.auth,
      AddressValidators.editAddress(),
      GlobalMiddleware.checkError,
      AddressController.editAddress
    );
  }

  deleteRoutes() {
    this.router.get(
      "/delete/:id",
      GlobalMiddleware.auth,
      AddressController.deleteAddresses
    );
  }
}

export default new AddressRouter().router;
