import User from "../models/User";
import { validationResult } from "express-validator";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import * as Bcrypt from "bcrypt";

export class UserController {
  private static encryptPassword(req, res, next) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  static async signup(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    // const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const phone = req.body.phone;
    const verification_token = Utils.generateVerificationToken(6);

    const hash = await UserController.encryptPassword(req, res, next);

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
      res.send(user);

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
    const email = req.body.email;
    const verification_token = req.body.verification_token;

    try {
      const user = await User.findOne(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
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
    const email = req.query.email;
    const verification_token = Utils.generateVerificationToken(6);

    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_UTILS_TIME,
        }
      );
      if (user) {
        await NodeMailer.sendMail({
          to: user.email,
          subject: "Resend verification email",
          html: `<h1>Your Otp is ${verification_token}</h1>`,
        });
        res.json({ success: true });
      } else {
        throw new Error("User Does not exist");
      }
    } catch (e) {
      next(e);
    }
  }
}
