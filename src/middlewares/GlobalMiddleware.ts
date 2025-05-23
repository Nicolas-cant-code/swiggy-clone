import { validationResult } from "express-validator";
import { JWT } from "../utils/Jwt";

export class GlobalMiddleware {
  static checkError(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }

  static async auth(req, res, next) {
    const header_auth = req.headers.authorization;
    const token = header_auth ? header_auth.slice(7, header_auth.length) : null;

    try {
      req.errorStatus = 401;
      const decoded = await JWT.jwtVerify(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }
}
