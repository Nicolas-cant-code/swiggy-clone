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
    const perPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const prevPage = currentPage - 1;
    let nextPage = currentPage + 1;

    try {
      const restaurants_doc_count = await Restaurant.countDocuments({
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
      if (!restaurants_doc_count) {
        res.json({
          restaurants: [],
          perPage,
          currentPage,
          nextPage: null,
          prevPage,
          totalPages: 0,
        });
      }
      const totalPages = Math.ceil(restaurants_doc_count / perPage);
      if (currentPage > totalPages) {
        throw new Error("No more Restaurants to show");
      }
      if (totalPages === 0 || totalPages === currentPage) {
        nextPage = null;
      }

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
      })
        .skip(perPage * currentPage - perPage)
        .limit(perPage);
      res.json({
        restaurants,
        perPage,
        currentPage,
        nextPage,
        prevPage,
        totalPages,
      });
    } catch (e) {
      next(e);
    }
  }

  static async searchNearbyRestaurants(req, res, next) {
    const EARTH_RADIUS_KM = 6378.1;
    const perPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const prevPage = currentPage - 1;
    let nextPage = currentPage + 1;

    try {
      const restaurants_doc_count = await Restaurant.countDocuments({
        status: "active",
        name: { $regex: req.query.name, $options: "i" },
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [
                parseFloat(req.query.Lng),
                parseFloat(req.query.Lat),
              ],
            },
            $maxDistance: parseFloat(req.query.radius) * EARTH_RADIUS_KM,
          },
        },
      });
      if (!restaurants_doc_count) {
        res.json({
          restaurants: [],
          perPage,
          currentPage,
          nextPage: null,
          prevPage,
          totalPages: 0,
        });
      }
      const totalPages = Math.ceil(restaurants_doc_count / perPage);
      if (currentPage > totalPages) {
        throw new Error("No more Restaurants to show");
      }
      if (totalPages === 0 || totalPages === currentPage) {
        nextPage = null;
      }

      const restaurants = await Restaurant.find({
        status: "active",
        name: { $regex: req.query.name, $options: "i" },
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [
                parseFloat(req.query.Lng),
                parseFloat(req.query.Lat),
              ],
            },
            $maxDistance: parseFloat(req.query.radius) * EARTH_RADIUS_KM,
          },
        },
      })
        .skip(perPage * currentPage - perPage)
        .limit(perPage);
      res.json({
        restaurants,
        perPage,
        currentPage,
        nextPage,
        prevPage,
        totalPages,
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
