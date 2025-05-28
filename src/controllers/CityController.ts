import City from "../models/City";

export class CityController {
  static async addCity(req, res, next) {
    const name = req.body.name;
    const lat = req.body.Lat;
    const lng = req.body.Lng;
    const status = req.body.status;
    try {
      const data = { name, lat, lng, status };
      let city = await new City(data).save();
      res.send(city);
    } catch (e) {
      next(e);
    }
  }

  static async getCities(req, res, next) {
    try {
      const citiess = await City.find({ status: "active" });
      res.send(citiess);
    } catch (e) {
      next(e);
    }
  }
}
