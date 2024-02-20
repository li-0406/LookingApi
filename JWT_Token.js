import jwt from "jsonwebtoken";
import { errorMessage } from "./errorMessage.js";

const JWT_Token = (req, res, next, callBack) => {
  const token = req.cookies.JWT_token; //在index.js 使用app.use(cookieParser()) 來抓取

  if (!token) return next(errorMessage(401, "請先登入"));
  jwt.verify(token, process.env.JWT, (err, payload) => {
    if (err) return next(errorMessage(403, "TOKEN無效，解開JWT失敗"));
    req.userData = payload; //解碼後是一開始的user.id與user.isadmin
    callBack();
  });
};

//判斷是不是一般會員或管理員
export const verifyUser = (req, res, next) => {
  JWT_Token(req, res, next, () => {
    const apiUserId = req.params.id;
    if (req.userData.id === apiUserId || req.userData.isAdmin) {
      next();
    } //next 讓他可以往下執行到實際要做的RoutesController
    else {
      next(errorMessage(403, "只能修改個人自己的權限或是你不是管理員"));
    }
  });
};

//判斷是否為管理員
export const verifyAdmin = (req, res, next) => {
  JWT_Token(req, res, next, () => {
    if (req.userData.isAdmin) {
      next();
    } else {
      next(errorMessage(403, "你沒有管理員權限"));
    }
  });
};
