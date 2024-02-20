import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updatedOrder,
} from "../RoutesController/order.js";
//這邊前面的url是/api/v1/Order
const router = express.Router();
//創建第一筆order資料
router.post("/", createOrder);
//抓單筆order資料
router.get("/find/:id", getOrder);
//單筆order資料做修改
router.put("/:id", updatedOrder);
//刪除order資料
router.delete("/:id", deleteOrder);
//抓取所有order資料
router.get("/", getAllOrders);
export default router;
