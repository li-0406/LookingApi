import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import hotelsApiRoute from "./ApiRoutes/hotels.js";
import roomsApiRoute from "./ApiRoutes/rooms.js";
import usersApiRoute from "./ApiRoutes/users.js";
import authApiRoute from "./ApiRoutes/auth.js";
import orderApiRoute from "./ApiRoutes/order.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const port = 5000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("disconnected to mongoDB");
    throw error;
  }
};
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

app.listen(port, () => {
  console.log(`Example app listening on ports56 ${port}`);
  connect();
});
app.use(express.json()); //可以接收json
app.use(cookieParser()); //自動抓取cookie

app.use("/api/v1/hotels", hotelsApiRoute);
app.use("/api/v1/rooms", roomsApiRoute);
app.use("/api/v1/users", usersApiRoute);
app.use("/api/v1/auth", authApiRoute);
app.use("/api/v1/order", orderApiRoute);

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "中間ApiRoute出錯";
  return res.status(errorStatus).json({
    //return回去讓他可以被next(error) catch
    status: errorStatus,
    Message: errorMessage,
  });
});
