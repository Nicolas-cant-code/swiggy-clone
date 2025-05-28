import Category from "../models/Category";
import Item from "../models/Item";

export class ItemController {
  static async addItem(req, res, next) {
    const itemData = req.body;
    const path = req.file.path;
    try {
      let restaurantData = {
        name: itemData.res_name,
        price: parseInt(itemData.price),
        status: itemData.status,
        category_id: itemData.category_id,
        restaurant_id: itemData.restaurant._id,
        cover: path,
        description: itemData.description || "",
        veg: itemData.veg,
      };

      const itemDoc = await new Item(itemData).save();
      res.send(itemDoc);
    } catch (e) {
      next(e);
    }
  }

  static async getMenu(req, res, next) {
    const restaurant = req.restaurant;
    try {
      const categories = await Category.find(
        {
          restaurant_id: restaurant._id,
        },
        { __v: 0 }
      );
      const items = await Item.find({
        // status: true,
        restaurant_id: restaurant._id,
      });
      res.json({
        restaurant,
        categories,
        items,
      });
    } catch (e) {
      next(e);
    }
  }
}
