import Order from "../models/Order.js";
import { errorMessage } from "../errorMessage.js";

export const createOrder = async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    res.send(200, saveOrder);
  } catch (error) {
    next(errorMessage(500, "建立訂單失敗，請確認格式", error));
  }
};

export const getOrder = async (req, res, next) => {
  const id = req.params.id;
  try {
    const getOrder = await Order.findById(id);
    res.send(200, getOrder);
  } catch (error) {
    next(errorMessage(500, "找不到訂單資料，請檢查使否有此id", error));
  }
};

export const updatedOrder = async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    res.send(200, updatedOrder);
  } catch (error) {
    next(
      errorMessage(
        500,
        "修改失敗，請確認是否有其id與是否欄位輸入格式正確",
        error
      )
    );
  }
};

export const deleteOrder = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    await Order.findByIdAndDelete(id);
    res.status(200).json("刪除訂單資料成功");
  } catch (error) {
    next(errorMessage(500, "刪除失敗，請確認是否有其id", error));
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const OrdersList = await Order.find();
    res.status(200).json(OrdersList);
  } catch (error) {
    next(errorMessage(500, "無法抓取所有訂單資料", error));
  }
};
