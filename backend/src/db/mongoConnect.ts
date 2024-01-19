import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./.env.local" });
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

  try {
    await mongoose.connect(DATABASE_SERVER);
    console.log("mongo connected listening on port:", port);
  } catch (err) {
    throw err;
  }
}
