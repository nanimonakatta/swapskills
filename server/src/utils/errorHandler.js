export const errorHandler = function(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  let message = error.message;

  res
    .status(statusCode)
    .json({
      success: false,
      statusCode: statusCode,
      message: message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    });
}