import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import { JWT } from "../utils/Jwt";

export class UserController {
  static async signup(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const phone = req.body.phone;
    const verification_token = Utils.generateVerificationToken(6);

    const hash = await Utils.encryptPassword(password);

    const data = {
      email,
      verification_token,
      verification_token_time: Date.now() + new Utils().MAX_UTILS_TIME,
      phone,
      password: hash,
      name,
      type,
      status,
    };

    try {
      let user = await new User(data).save();
      const payload = {
        uer_id: user._id,
        email: user.email,
        type: user.type,
      };
      const token = JWT.jwtSign(payload);
      res.json({ user: user, token: token });

      await NodeMailer.sendMail({
        to: email,
        subject: "Verify your email",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verify(req, res, next) {
    const email = req.user.email;
    const verification_token = req.body.verification_token;

    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          updated_at: Date.now(),
          email_verified: true,
        },
        {
          new: true,
        }
      );

      if (user) {
        res.send(user);
      } else {
        throw new Error("Invalid token or token expired");
      }
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    const email = req.user.email;
    const verification_token = Utils.generateVerificationToken(6);

    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          updated_at: Date.now(),
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_UTILS_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: user.email,
          subject: "Resend verification email",
          html: `<h1>Your Otp is ${verification_token}</h1>`,
        });
      } else {
        throw new Error("User Does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const user = req.user;
    const password = req.query.password;

    const data = {
      password,
      encrypt_password: user.password,
    };

    Utils.comparePassword(data);
    try {
      await Utils.comparePassword(data);
      const payload = {
        user_id: user._id,
        email: user.email,
      };
      const token = JWT.jwtSign(payload);
      res.json({ user: user, token: token });
    } catch (err) {
      next(err);
    }

    res.send(req.user);
  }

  static async sendResetPassword(req, res, next) {
    const email = req.query.email;
    const reset_password_verification_token =
      Utils.generateVerificationToken(6);

    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          updated_at: Date.now(),
          reset_password_verification_token: reset_password_verification_token,
          reset_password_verification_token_time:
            Date.now() + new Utils().MAX_UTILS_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: user.email,
          subject: "Reset password email verification OTP",
          html: `<h1>Your Otp is ${reset_password_verification_token}</h1>`,
        });
      } else {
        throw new Error("User Does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordToken(req, res, next) {
    try {
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;

    try {
      const encrypt_password = await Utils.encryptPassword(new_password);
      const updated_user = await User.findOneAndUpdate(
        { _id: user._id },
        { updated_at: new Date(), password: encrypt_password },
        { new: true }
      );
      if (updated_user) {
        res.send(updated_user);
      } else {
        throw new Error("User does not exist");
      }
    } catch (e) {
      next(e);
    }
  }
}
