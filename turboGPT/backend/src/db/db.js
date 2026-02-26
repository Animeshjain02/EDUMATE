// import mongoose from "mongoose";

// const dbURI = process.env.MONGODB_URI;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(dbURI);
//     console.log("connected to DB");
//   } catch (error) {
//     console.log("Error while connecting",error);
//   }
// };

// const disconnectDB = async () => {
//   try {
//     await mongoose.disconnect();
//     console.log("disconnected from DB");
//   } catch (error) {
//     console.log("diconnected from db due to ::", error);
//   }
// };

// export { connectDB, disconnectDB };


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI =>", process.env.MONGO_URI); // debug
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ connected to DB");
  } catch (error) {
    console.error("❌ Error while connecting to DB:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("disconnected from DB");
  } catch (error) {
    console.log("disconnected from DB due to ::", error);
  }
};

export { connectDB, disconnectDB };
