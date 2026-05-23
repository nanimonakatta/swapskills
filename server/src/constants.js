const DB_NAME = "swapskills";
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // sameSite: "strict"
}

export {
  DB_NAME,
  options
}