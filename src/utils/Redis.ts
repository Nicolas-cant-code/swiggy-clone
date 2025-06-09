import { createClient } from "redis";
import { getEnvironmentVariables } from "../environments/environment";

const client = createClient({
  username: getEnvironmentVariables().redis.username,
  password: getEnvironmentVariables().redis.password,
  socket: {
    host: "redis-16567.c341.af-south-1-1.ec2.redns.redis-cloud.com",
    port: getEnvironmentVariables().redis.port,
  },
});

export class Redis {
  static connectToRedis() {
    client
      .connect()
      .then(() => {
        console.log("Connected to Redis");
      })
      .catch((error) => {
        throw error;
      });
  }

  static async setValue(key: string, value: string, expires_at?) {
    try {
      let options: any = {};
      if (expires_at) {
        options = {
          EX: expires_at,
        };
      }
      await client.set(key, value, options);
      return;
    } catch (error) {
      console.error("Error setting value in Redis:", error);
      throw "Server not Connected. Please try again";
    }
  }

  static async getValue(key: string) {
    try {
      const value = await client.get(key);
      return value;
    } catch (error) {
      console.error("Error setting value in Redis:", error);
      throw "Your session expired. Please log in again";
    }
  }

  static async delKey(key: string) {
    try {
      await client.del(key);
    } catch (error) {
      console.error("Error setting value in Redis:", error);
      throw "Server not Connected. Please try again";
    }
  }
}
