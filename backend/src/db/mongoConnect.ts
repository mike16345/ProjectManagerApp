import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

const pathToEnv = path.resolve(__dirname, "..", "..", ".env.local");
dotenv.config({ path: pathToEnv });
main().catch((err) => {
  console.error(err);
  console.log(
    "Failed to connect to MongoDB. Please make sure env.local file contains credentials."
  );
});

async function main() {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const cluster = "projectmanagementserver";
  const DATABASE_SERVER = `mongodb+srv://${username}:${password}@${cluster}.7hss9cc.mongodb.net/`;
  const port = process.env.PORT;
  console.log("database server:", DATABASE_SERVER);

  try {
    await mongoose.connect(DATABASE_SERVER);
    console.log("mongo connected listening on port:", port);
  } catch (err) {
    throw err;
  }
}
