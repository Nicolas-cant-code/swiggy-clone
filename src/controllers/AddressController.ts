import { create } from "domain";
import Address from "../models/Address";

export class AddressController {
  static async addAddress(req, res, next) {
    const data = req.body;
    const user_id = req.user.aud;
    try {
      const addressData = {
        user_id,
        title: data.title,
        landmark: data.landmark,
        address: data.address,
        house: data.house,
        Lat: data.Lat,
        Lng: data.Lng,
      };
      let address = await new Address(addressData).save();

      const response_address = {
        title: address.title,
        landmark: address.landmark,
        address: address.address,
        house: address.house,
        Lat: address.Lat,
        Lng: address.Lng,
        created_at: address.created_at,
        updated_at: address.updated_at,
      };
      res.send(response_address);
    } catch (e) {
      next(e);
    }
  }

  static async getAddresses(req, res, next) {
    const user_id = req.user.aud;
    try {
      const addresses = await Address.find({ user_id }, { user_id: 0, __v: 0 });
      res.send(addresses);
    } catch (e) {
      next(e);
    }
  }

  static async getLimitedAddresses(req, res, next) {
    const user_id = req.user.aud;
    const limit = req.query.limit;
    try {
      const addresses = await Address.find(
        { user_id },
        { user_id: 0, __v: 0 }
      ).limit(limit);
      res.send(addresses);
    } catch (e) {
      next(e);
    }
  }

  static async deleteAddresses(req, res, next) {
    const user_id = req.user.aud;
    const id = req.params.id;
    try {
      await Address.findOneAndDelete({ user_id, id });
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  static async getAddressesById(req, res, next) {
    const user_id = req.user.aud;
    const id = req.params.id;
    try {
      const address = await Address.findOne(
        { user_id, id },
        {
          projection: { user_id: 0, __v: 0 },
        }
      );
      res.send(address);
    } catch (e) {
      next(e);
    }
  }

  static async editAddress(req, res, next) {
    const user_id = req.user.aud;
    const id = req.params.id;
    const data = req.body;
    try {
      const address = await Address.findOneAndUpdate(
        {
          user_id,
          id,
        },
        {
          user_id,
          titleL: data.title,
          landmark: data.landmark,
          address: data.address,
          house: data.house,
          Lat: data.Lat,
          Lng: data.Lng,
          updated_at: new Date(),
        },
        {
          new: true,
          projection: { user_id: 0, __v: 0 },
        }
      );
      if (address) {
        res.send(address);
      } else {
        throw new Error("Address not found");
      }
    } catch (e) {
      next(e);
    }
  }

  static async checkAddress(req, res, next) {
    const user_id = req.user.aud;
    const data = req.query;
    try {
      const address = await Address.find(
        { user_id, Lat: data.Lat, Lng: data.Lng },
        { user_id: 0, __v: 0 }
      );
      res.send(address);
    } catch (e) {
      next(e);
    }
  }
}
