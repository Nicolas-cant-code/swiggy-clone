import * as Bcrypt from "bcrypt";

export class Utils {
  public MAX_UTILS_TIME = 5 * 60 * 1000;

  static generateVerificationToken(digit: number) {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < digit; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  static encryptPassword(password) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  static comparePassword(data: { password: string; encrypt_password: string }) {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(data.password, data.encrypt_password, (err, isMatch) => {
        if (err) {
          reject(err);
        } else if (!isMatch) {
          reject(new Error("User and password do not match"));
        } else {
          resolve(true);
        }
      });
    });
  }
}
