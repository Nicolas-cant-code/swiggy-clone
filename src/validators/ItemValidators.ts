import { body, param } from "express-validator";
import Restaurant from "../models/Restaurant";
import Category from "../models/Category";

export class ItemValidators {
  static addItem() {
    return [
      body("itemImages", "Item image is required").custom((cover, { req }) => {
        if (req.file) {
          return true;
        } else {
          throw new Error("Item image not uploaded");
        }
      }),
      body("name", "Item name is required").isString(),
      body("restaurant_id", "Restaurant ID is required")
        .isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id)
            .then((restaurant) => {
              if (restaurant) {
                return true;
              } else {
                throw "Restaurant does not exist";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      body("category_id", "Category ID is required")
        .isString()
        .custom((category_id, { req }) => {
          return Category.findById({
            _id: category_id,
            restaurant_id: req.body.restaurant_id,
          })
            .then((category) => {
              if (category) {
                return true;
              } else {
                throw "Category does not exist";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      body("status", "Status is required").isBoolean(),
      body("price", "Price is required").isNumeric(),
      body("veg", "Item is veg or not is required").isBoolean(),
    ];
  }

  static getMenuItems() {
    return [
      param("restaurantId", "Restaurant ID is required")
        .isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id)
            .then((restaurant) => {
              if (restaurant) {
                req.restaurant = restaurant;
                return true;
              } else {
                throw "Restaurant does not exist";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
    ];
  }
}
