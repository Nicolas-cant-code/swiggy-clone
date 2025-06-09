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
    const token = header_auth.split(" ")[1];

    try {
      if (!token) {
        next(new Error("Correct token is required"));
        req.errorStatus = 401;
      }
      const decoded = await JWT.jwtVerify(token);
      req.user = decoded;
      next();
    } catch (error) {
      req.errorStatus = 401;
      next(new Error("Correct token is required"));
    }
  }

  static async decodeRefreshToken(req, res, next) {
    const refreshToken = req.body.refresh_token;

    try {
      if (!refreshToken) {
        req.errorStatus = 403;
        next(new Error("Access is Forbiden. User doesn't exist"));
      }
      const decoded = await JWT.jwtVerifyRefreshToken(refreshToken);
      req.user = decoded;
      next();
    } catch (error) {
      req.errorStatus = 401;
      next(new Error("Your Session is expired. Please log in again"));
    }
  }

  static adminRole(req, res, next) {
    const user = req.user;
    if (user.type !== "admin") {
      next(new Error("Unauthorized access"));
      // req.errorStatus = 401;
    }
    next();
  }
}
