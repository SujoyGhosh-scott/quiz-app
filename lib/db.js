import mongoose from "mongoose";

const url = process.env.MONGO_URL;
let connection;

const startDB = async () => {
  if (!connection) {
    mongoose.set("strictPopulate", false);
    connection = await mongoose.connect(url);
  }
  return connection;
};

export default startDB;
