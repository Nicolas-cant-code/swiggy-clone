import { body } from "express-validator";

export class BannerValidators {
  static createBanner() {
    return [
      body("bannerImages", "Banner image is required").custom(
        (banner, { req }) => {
          if (req.file) {
            return true;
          } else {
            throw new Error("Banner image is required");
          }
        }
      ),
    ];
  }
}
