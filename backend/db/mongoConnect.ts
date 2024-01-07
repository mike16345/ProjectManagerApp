import mongoose from "mongoose";
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/project-manager");
  console.log("mongo connected litening on port " + process.env.PORT);
}
