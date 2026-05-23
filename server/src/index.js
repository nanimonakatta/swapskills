import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
  .then(function () {
    const port = process.env.PORT || 7000;
    const server = app.listen(port, function () {
      console.log(`MongoDB connection established!! Server is listening on port ${port}`);
    });
    server.on("error", function (error) {
      console.log("Error: ", error);
      process.exit(1);
    })
  }).catch(function (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  });