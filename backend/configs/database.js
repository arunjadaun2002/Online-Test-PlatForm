const mongoose = require("mongoose");
require("dotenv").config();

const uri =
  "mongodb+srv://<username>:<password>@myatlasclusteredu.cnvw2mx.mongodb.net/<dbName>?retryWrites=true&w=majority&appName=myAtlasClusterEDU";

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!username || !password || !dbName) {
  console.error("Missing DB credentials in environment variables.");
  process.exit(1);
}

let dbURL = uri
  .replace("<username>", username)
  .replace("<password>", password)
  .replace("<dbName>", dbName);

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("----------------- DB Connected ----------------------");
  })
  .catch((err) => {
    console.log("DB Connect Failed:\n");
    console.log(err);
  });
