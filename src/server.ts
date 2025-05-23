import * as express from "express";
import * as mongoose from "mongoose";
import { getEnvironmentVariables } from "./environments/environment";
import UserRouter from "./routers/UserRouter";
import * as bodyParser from "body-parser";
import * as cors from "cors";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfigs() {
    this.connectMongoDB();
    this.allowCors();
    this.conigBodyParser();
  }

  conigBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  connectMongoDB() {
    mongoose
      .connect(getEnvironmentVariables().db_url, {
        tls: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => console.log("Error connecting to Database:")); //, error));
  }

  allowCors() {
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use("/api/user/", UserRouter);
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({ message: "Not Found", status: 404 });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong. Please try again.",
        status: errorStatus,
      });
    });
  }
}
