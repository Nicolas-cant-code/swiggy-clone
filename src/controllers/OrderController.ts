import Order from "../models/Order";

export class OrderController {
  static async placeOrder(req, res, next) {
    const data = req.body;
    const user_id = req.user.aud;
    const restaurant = req.restaurant;
    try {
      const orderData = {
        instruction: data.instruction || "",
        user_id,
        restaurant_id: data.restaurant_id,
        order: data.order,
        address: data.address,
        status: data.status,
        total: data.total,
        grandTotal: data.grandTotal,
        deliveryCharge: data.deliveryCharge,
        payment_status: data.payment_status,
        payment_mode: data.payment_mode,
      };
      let order = await new Order(orderData).save();

      const response_order = {
        restaurant_id: restaurant,
        address: order.address,
        order: JSON.parse(order.order),
        instruction: order.instruction || "",
        status: order.status,
        total: order.total,
        grandTotal: order.grandTotal,
        deliveryCharge: order.deliveryCharge,
        payment_status: order.payment_status,
        payment_mode: order.payment_mode,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
      res.send(response_order);
    } catch (e) {
      next(e);
    }
  }

  static async getUserOrders(req, res, next) {
    const user_id = req.user.aud;
    const perPage = 5;
    const currentPage = parseInt(req.query.page) || 1;
    const prevPage = currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const orders_doc_count = await Order.countDocuments({ user_id: user_id });

      if (!orders_doc_count) {
        res.json({
          orders: [],
          perPage,
          currentPage,
          nextPage: null,
          prevPage,
          totalPages: 0,
        });
      }

      const totalPages = Math.ceil(orders_doc_count / perPage);
      if (currentPage > totalPages) {
        throw new Error("No more Orders to show");
      }
      if (totalPages === 0 || totalPages === currentPage) {
        nextPage = null;
      }

      const orders = await Order.find({ user_id }, { user_id: 0, __v: 0 })
        .skip(perPage * currentPage - perPage)
        .limit(perPage)
        .sort({ created_at: -1 })
        .populate("restaurant_id")
        .exec();
      // res.send(orders);

      res.json({
        orders,
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
}
