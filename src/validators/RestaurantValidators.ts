import { body, query } from "express-validator";
import User from "../models/User";

export class RestaurantValidators {
  static addRestaurant() {
    return [
      body("name", "Owner name is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({ email })
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
      body("phone", "Phone number is required").isString(),
      body("password", "Password is required")
        .isAlphanumeric()
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be between 6 and 20 characters"),

      body("restaurantImages", "Cover image is required").custom(
        (cover, { req }) => {
          if (req.file) {
            return true;
          } else {
            throw new Error("Cover image not uploaded");
          }
        }
      ),

      body("res_name", "Restaurant name is required").isString(),
      body("short_name", "Short name is required").isString(),
      body("openTime", "Opeining time is required").isString(),
      body("closeTime", "Closing time is required").isString(),
      body("price", "Price is required").isString(),
      body("delivery_time", "Delivery time is required").isString(),
      body("status", "Status is required").isString(),
      body("address", "Address is required").isString(),
      body("location", "Location is required").isString(),
      body("cuisines", "Cuisines are required").isString(),
      body("city_id", "City ID is required"),
    ];
  }

  static getNearbyRestaurants() {
    return [
      query("Lat", "Latitude is required").isNumeric(),
      query("Lng", "Longitude is required").isNumeric(),
      query("radius", "Radius is required").isNumeric(),
    ];
  }

  static searchNearbyRestaurants() {
    return [
      query("Lat", "Latitude is required").isNumeric(),
      query("Lng", "Longitude is required").isNumeric(),
      query("radius", "Radius is required").isNumeric(),
      query("name", "Search term is required").isString(),
    ];
  }
}
