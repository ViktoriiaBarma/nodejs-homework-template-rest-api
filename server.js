const app = require("./app");
const mongoose = require("mongoose");
const { MONGO_URL, PORT } = process.env;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT);
    
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
