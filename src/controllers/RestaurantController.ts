import Category from "../models/Category";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import { Utils } from "../utils/Utils";

export class RestaurantController {
  static async addRestaurant(req, res, next) {
    const restaurant = req.body;
    const verification_token = Utils.generateVerificationToken(6);
    const path = req.file.path;
    try {
      const hash = await Utils.encryptPassword(req.body.password);
      const data = {
        email: restaurant.email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_UTILS_TIME,
        phone: restaurant.phone,
        password: hash,
        name: restaurant.name,
        type: "restaurant",
        status: "active",
      };
      const user = await new User(data).save();

      let restaurantData = {
        name: restaurant.res_name,
        location: JSON.parse(restaurant.location),
        cuisines: JSON.parse(restaurant.cuisines),
        address: restaurant.address,
        closeTime: restaurant.closeTime,
        openTime: restaurant.openTime,
        delivery_time: parseInt(restaurant.delivery_time),
        price: parseInt(restaurant.price),
        status: restaurant.status,
        city_id: restaurant.city_id,
        user_id: user._id,
        cover: path,
        description: restaurant.description || "",
      };

      const restaurantDoc = await new Restaurant(restaurantData).save();

      //    create categories
      const categoriesData = JSON.parse(
        restaurant.categories.map((x) => {
          return { name: x, restaurant_id: restaurantDoc._id };
        })
      );
      const categories = Category.insertMany(categoriesData);

      res.send(restaurantDoc);
    } catch (e) {
      next(e);
    }
  }

  static async getNearbyRestaurants(req, res, next) {
    try {
      const restaurants = await Restaurant.find({
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
      res.send(restaurants);
    } catch (e) {
      next(e);
    }
  }

  static async searchNearbyRestaurants(req, res, next) {
    try {
      const restaurants = await Restaurant.find({
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
      res.send(restaurants);
    } catch (e) {
      next(e);
    }
  }

  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await Restaurant.find({ status: "active" })
        .populate("user_id", "name email phone")
        .populate("city_id", "name");
      res.send(restaurants);
    } catch (e) {
      next(e);
    }
  }
}
