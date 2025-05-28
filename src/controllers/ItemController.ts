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

  static async getItems(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }
}
