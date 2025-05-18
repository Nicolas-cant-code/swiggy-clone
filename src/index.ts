import * as express from "express";
import * as mongoose from "mongoose";
import { getEnvironmentVariables } from "./environments/environment";

let app: express.Application = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

mongoose.connect(getEnvironmentVariables().db_url).then(() => {
  console.log("Connected to MongoDB");
});
