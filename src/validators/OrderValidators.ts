import { body } from "express-validator";
import Restaurant from "../models/Restaurant";

export class OrderValidators {
  static placeOrder() {
    return [
      body("restaurant_id", "Restaurant ID is required").isString(),
      body("restaurant", "Restaurant is required")
        .isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id)
            .then((restaurant) => {
              if (restaurant) {
                // req.restaurant = restaurant;
                return true;
              } else {
                throw "Restaurant does not exist";
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        }),
      ,
      body("order", "Order is required").isString(),
      body("address", "Address is required").isString(),
      body("total", "Total is required").isNumeric(),
      body("grandTotal", "Grand Total is required").isNumeric(),
      body("deliveryCharge", "Delivery Charge is required").isNumeric(),
      body("payment_status", "Payment status is required").isBoolean(),
      body("payment_mode", "Payment mode is required").isString(),
      body("status", "Status is required").isString(),
    ];
  }
}
