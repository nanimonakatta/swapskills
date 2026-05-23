export const asyncHandler = function(requestHandler) {
  return async function(req, res, next) {
    try {
      return await requestHandler(req, res, next);
    } catch(error) {
      next(error);
    }
  }
}