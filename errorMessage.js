export const errorMessage = (status, message, err) => {
  const error = new Error();
  error.status = status;
  const orignalErr = err?.message || "條件錯誤";
  error.message = err ? `${message}\n詳細錯誤：${orignalErr}` : message;
  return error;
};
