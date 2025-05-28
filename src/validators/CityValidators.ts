import { body } from "express-validator";

export class CityValidators {
  static addCity() {
    return [
      body("name", "City name is required").isString(),
      body("Lat", "Latitude is required").isNumeric(),
      body("Lng", "Longitude is required").isNumeric(),
      body("status", "Status is required").isString(),
    ];
  }
}
