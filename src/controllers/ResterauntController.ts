import Category from "../models/Category";
import Resteraunt from "../models/Resteraunt";
import User from "../models/User";
import { Utils } from "../utils/Utils";

export class ResterauntController {
  static async addResteraunt(req, res, next) {
    const resteraunt = req.body;
    const verification_token = Utils.generateVerificationToken(6);
    const path = req.file.path;
    try {
      const hash = await Utils.encryptPassword(req.body.password);
      const data = {
        email: resteraunt.email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_UTILS_TIME,
        phone: resteraunt.phone,
        password: hash,
        name: resteraunt.name,
        type: "resteraunt",
        status: "active",
      };
      const user = await new User(data).save();

      //    create categories
      const categoriesData = JSON.parse(
        resteraunt.categories.map((x) => {
          return { name: x, user_id: user._id };
        })
      );
      const categories = Category.insertMany(categoriesData);

      let resterauntData = {
        name: resteraunt.res_name,
        short_name: resteraunt.short_name,
        location: JSON.parse(resteraunt.location),
        cuisines: JSON.parse(resteraunt.cuisines),
        address: resteraunt.address,
        closeTime: resteraunt.closeTime,
        openTime: resteraunt.openTime,
        delivery_time: parseInt(resteraunt.delivery_time),
        price: parseInt(resteraunt.price),
        status: resteraunt.status,
        city_id: resteraunt.city_id,
        user_id: user._id,
        cover: path,
        description: resteraunt.description || "",
      };

      const resterauntDoc = await new Resteraunt(resterauntData).save();
      res.send(resterauntDoc);
    } catch (e) {
      next(e);
    }
  }

  static async getNearbyResteraunts(req, res, next) {
    try {
      const resteraunts = await Resteraunt.find({
        status: "active",
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(req.query.Lng), parseFloat(req.query.Lat)],
              parseFloat(req.query.radius) / 6378.1,
            ],
          },
        },
      });
      res.send(resteraunts);
    } catch (e) {
      next(e);
    }
  }

  static async searchNearbyResteraunts(req, res, next) {
    try {
      const resteraunts = await Resteraunt.find({
        status: "active",
        name: { $regex: req.query.name, $options: "i" },
        location: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(req.query.Lng), parseFloat(req.query.Lat)],
              parseFloat(req.query.radius) / 6378.1,
            ],
          },
        },
      });
      res.send(resteraunts);
    } catch (e) {
      next(e);
    }
  }
}
