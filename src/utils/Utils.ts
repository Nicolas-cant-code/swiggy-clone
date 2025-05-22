export class Utils {
  public MAX_UTILS_TIME = 5 * 60 * 1000;

  static generateVerificationToken(digit: number) {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < digit; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return parseInt(otp);
  }
}
