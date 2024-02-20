import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { errorMessage } from "../errorMessage.js";

//創建新房間
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);
  try {
    const saveRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: saveRoom._id },
      });
    } catch (error) {
      next(errorMessage(500, "找不到hotel id 無法上傳room更新", error));
    }
    res.status(200).json(saveRoom);
  } catch (error) {
    next(errorMessage(500, "room的上傳失敗，可能為格式錯誤", error));
  }
};

//單筆房間
export const getRoom = async (req, res, next) => {
  try {
    const getRoom = await Room.findById(req.params.id);
    res.status(200).json(getRoom);
  } catch (error) {
    next(errorMessage(500, "搜尋失敗，找不到其ID", error));
  }
};

//全部房間
export const getAllRooms = async (req, res, next) => {
  try {
    const allRooms = await Room.find();
    res.status(200).json(allRooms);
  } catch (error) {
    next(errorMessage(500, "無法抓取所有房間資料", error));
  }
};

//單筆飯店所有房間
export const getHotelRooms = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    const hoteldata = await Hotel.findById(hotelId);
    try {
      const roomsList = await Promise.all(
        hoteldata.rooms.map((i) => Room.findById(i))
      );
      //到Room資料庫裡找出符合該飯店房間的 id
      res.status(200).json(roomsList);
    } catch (error) {
      next(
        errorMessage(
          500,
          "發生錯誤，找尋房間時發生錯誤，可能為Room資料庫問題",
          error
        )
      );
    }
  } catch (error) {
    next(errorMessage(500, "找不到hotel id 無法查看rooms", error));
  }
};

//更新房間
export const updatedRoom = async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const getRoom = await Room.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    res.status(200).json(getRoom);
  } catch (error) {
    next(errorMessage(500, "更新失敗，可能為格式錯誤或是找不到其ID", error));
  }
};

//更新上傳unavailableDates的資料
export const updatedRoomDates = async (req, res, next) => {
  const roomNumberId = req.params.id;
  const dates = req.body.dates;
  try {
    const updatedRoomDates = await Room.updateOne(
      { "roomNumbers._id": roomNumberId },
      {
        $push: {
          "roomNumbers.$.unavailableDates": dates,
        },
      }
    );
    res.status(200).json({
      msg: "上傳日期成功",
      updatedRoomDates,
    });
  } catch (error) {
    next(
      errorMessage(500, "預訂日期更新失敗，可能為格式錯誤或是找不到其ID", error)
    );
  }
};

//刪除(要刪Room資料庫跟該飯店的rooms欄位的對應id)
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id); //先刪Rooms資料庫
    try {
      //再更新飯店房間資料(pull抽掉指定元素)
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json("成功刪除房間資訊");
  } catch (error) {
    next(errorMessage(500, "刪除失敗，找不到其ID", error));
  }
};
