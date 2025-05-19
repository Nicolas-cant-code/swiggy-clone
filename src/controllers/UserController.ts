import User from "../models/User";
import { validationResult } from "express-validator";

export class UserController {
  static async signup(req, res, next) {
    // const data = [{ name: "Nicolas" }];
    // res.status(200).send(data);
    // (req as any).errorStatus = 422;
    // const error = new Error("User email or password is incorrect");
    // next(error);
    // res.send(req.query);
    const errors = validationResult(req);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const phone = req.body.phone;

    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    }

    const data = {
      email,
      phone,
      password,
      name,
      type,
      status,
    };

    try {
      let user = await new User(data).save();
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
}
