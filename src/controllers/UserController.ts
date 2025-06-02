import User from "../models/User";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import { JWT } from "../utils/Jwt";
import { ref } from "process";

export class UserController {
  static async signup(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const phone = req.body.phone;
    const verification_token = Utils.generateVerificationToken(6);

    try {
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
      let user = await new User(data).save();
      const payload = {
        // aud: user._id,
        email: user.email,
        type: user.type,
      };
      const access_token = JWT.jwtSign(payload, user._id);
      const refresh_token = JWT.jwtSignRefreshToken(payload, user._id);
      res.json({
        user: user,
        token: access_token,
        refresh_token: refresh_token,
      });

      await NodeMailer.sendMail({
        to: email,
        subject: "Verify your email",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyUserEmailOTP(req, res, next) {
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
        aud: user._id,
        email: user.email,
        type: user.type,
      };
      const access_token = JWT.jwtSign(payload, user._id);
      const refresh_token = JWT.jwtSignRefreshToken(payload, user._id);
      res.json({
        user: user,
        token: access_token,
        refresh_token: refresh_token,
      });
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

  static sendResetPasswordToken(req, res, next) {
    res.json({ success: true });
  }

  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;

    try {
      const encrypt_password = await Utils.encryptPassword(new_password);
      const updated_user = await User.findByIdAndUpdate(
        user._id,
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

  static async profile(req, res, next) {
    const user = req.user;

    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        res.send(profile);
      } else {
        throw new Error("User does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async updatePhone(req, res, next) {
    const phone = req.body.phone;
    const user = req.user;

    try {
      const userData = await User.findById(
        user.aud,
        { phone: phone },
        { new: true, updated_at: new Date() }
      );
      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  static async updateUserProfile(req, res, next) {
    const phone = req.body.phone;
    const user = req.user;
    const new_email = req.body.email;
    const plain_password = req.body.password;
    const verification_token = Utils.generateVerificationToken(6);

    try {
      const userData = await User.findById(user.aud);
      if (!userData) throw new Error("User does not exist");
      await Utils.comparePassword({
        password: plain_password,
        encrypt_password: userData.password,
      });

      const updatedData = await User.findByIdAndUpdate(
        user.aud,
        {
          phone: phone,
          email: new_email,
          email_verified: false,
          verification_token: Utils.generateVerificationToken(6),
          verification_token_time: Date.now() + new Utils().MAX_UTILS_TIME,
          updated_at: new Date(),
        },
        { new: true }
      );
      const payload = {
        // aud: user.aud,
        email: updatedData.email,
        type: updatedData.type,
      };
      const access_token = JWT.jwtSign(payload, user.aud);
      const refresh_token = JWT.jwtSignRefreshToken(payload, user.aud);
      res.json({
        user: user,
        token: access_token,
        refresh_token: refresh_token,
      });

      await NodeMailer.sendMail({
        to: updatedData.email,
        subject: "Verify your email",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
    } catch (e) {
      next(e);
    }
  }

  static async checkRefreshToken(req, res, next) {
    const refreshToken = req.query.refresh_token;
    const user = req.user;

    try {
      const decoded_data = await JWT.jwtVerifyRefreshToken(refreshToken);
      if (decoded_data) {
        const payload = {
          // aud: user._id,
          email: user.email,
          type: user.type,
        };
        const access_token = JWT.jwtSign(payload, decoded_data.aud);
        const refresh_token = JWT.jwtSignRefreshToken(
          payload,
          decoded_data.aud
        );
        res.json({
          user: user,
          accessToken: access_token,
          refresh_token: refresh_token,
        });
      } else {
        req.errorStatus = 403;
        throw new Error("Access is Forbiden");
      }
    } catch (e) {
      req.errorStatus = 403;
      next(e);
    }
  }
}
