import mongoose from "mongoose";

const connectToDatabase = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}.mongodb.net/${process.env.DB_NAME}`
    )
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => console.error(error));
};

export default connectToDatabase;
