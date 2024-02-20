import express from "express";
import {
  createHotel,
  getHotel,
  updatedHotel,
  deleteHotel,
  getAllHotels,
  amountOfType,
  amountOfCities,
} from "../RoutesController/hotels.js";
import { verifyAdmin } from "../JWT_Token.js";

const router = express.Router();

//創建資料
router.post("/", verifyAdmin, createHotel);

//拿單筆資料
router.get("/find/:id", getHotel);

//修改
router.put("/:id", updatedHotel);

//刪除
router.delete("/:id", verifyAdmin, deleteHotel);

//所有飯店
router.get("/", getAllHotels);

//飯店種類(ex:飯店,公寓)
router.get("/amountOfType", amountOfType);

//該縣市住宿數量
router.get("/amountofcities", amountOfCities);

export default router;
