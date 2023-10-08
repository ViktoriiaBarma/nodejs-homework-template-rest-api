const app = require("./app");
const mongoose = require("mongoose");
const { URL } = process.env;
console.log(process.env.URL)

mongoose
  .connect(URL)
  .then(() => {
    console.log("Database connection successful");

    app.listen(process.env.PORT);
    
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });