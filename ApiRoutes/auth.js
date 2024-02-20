import express from "express";
import { register, login } from "../RoutesController/auth.js";

const router = express.Router();

//註冊
router.post("/register", register);

//登入
router.post("/login", login);

export default router;
