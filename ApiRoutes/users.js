import express from "express";
import {
  updateUser,
  deletedUser,
  getUser,
  getAllUsers,
} from "../RoutesController/users.js";
import { verifyAdmin, verifyUser } from "../JWT_Token.js";
const router = express.Router();

//更新user
router.put("/:id", verifyUser, updateUser);
//刪除
router.delete("/:id", verifyUser, deletedUser);
//讀取 單一用戶資料
router.get("/:id", verifyUser, getUser);
//讀取全部用戶資料
router.get("/", verifyAdmin, getAllUsers);

export default router;
