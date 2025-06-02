import { body, query } from "express-validator";

export class AddressValidators {
  static addAddress() {
    return [
      body("title", "Title is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("address", "Address is required").isString(),
      body("house", "House number is required").isString(),
      body("Lat", "Latitude is required").isNumeric(),
      body("Lng", "Longitude is required").isNumeric(),
    ];
  }

  static editAddress() {
    return [
      body("title", "Title is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("address", "Address is required").isString(),
      body("house", "House number is required").isString(),
      body("Lat", "Latitude is required").isNumeric(),
      body("Lng", "Longitude is required").isNumeric(),
    ];
  }

  static checkAddress() {
    return [
      query("Lat", "Latitude is required").isNumeric(),
      query("Lng", "Longitude is required").isNumeric(),
    ];
  }

  static getLimitedAddresses() {
    return [query("limit", "Limit is required").isNumeric()];
  }
}
