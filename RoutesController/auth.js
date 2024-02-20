import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { errorMessage } from "../errorMessage.js";
import jwt from "jsonwebtoken";

//註冊
export const register = async (req, res, next) => {
  const registerData = req.body;
  try {
    //檢查重複(之後可加email)
    const registerWrong = await User.findOne({
      username: registerData.username,
    });
    if (registerWrong) {
      return next(errorMessage(400, "錯誤，此帳號或信箱已被註冊"));
    }

    //加密
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(registerData.password, salt);

    const newUser = new User({
      // email: registerData.email,
      username: registerData.username,
      password: hash,
      isAdmin: registerData.isAdmin || false,
    });
    const saveUser = await newUser.save();
    res.status(200).json({
      msg: "註冊成功",
      data: saveUser,
    });
  } catch (error) {
    next(errorMessage(500, "註冊失敗", error));
  }
};

//登入
export const login = async (req, res, next) => {
  const loginData = req.body;
  try {
    //找尋是否有該帳號(之後加上email)
    const userData = await User.findOne({
      username: loginData.account,
    });
    if (!userData) return next(errorMessage(404, "沒有此使用者"));
    //解碼比對密碼
    const isPasswordCorrect = await bcrypt.compare(
      loginData.password,
      userData.password
    );
    if (!isPasswordCorrect) return next(errorMessage(404, "輸入密碼錯誤"));

    //登入成功發token
    const token = jwt.sign(
      { id: userData._id, isAdmin: userData.isAdmin },
      process.env.JWT
    );
    res
      .cookie("JWT_token", token, { httpOnly: true }) //把token放到cookie
      .status(200)
      .json({ userData, msg: "登入成功" });
  } catch (error) {
    next(errorMessage(500, "登入失敗", error));
  }
};
