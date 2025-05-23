import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/environment";

export class JWT {
  static jwtSign(payload) {
    return Jwt.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: "1h",
    });
  }

  static jwtVerify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key,
        (err, decoded) => {
          if (err) {
            reject(err);
          } else if (!decoded) {
            reject(new Error("User is not Authorized"));
          } else {
            resolve(decoded);
          }
        }
      );
    });
  }
}
