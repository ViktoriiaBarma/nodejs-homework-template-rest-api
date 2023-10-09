const jwt = require("jsonwebtoken");
const { handleError, catchAsync } = require("../utils");
const { SECRET_JWT } = process.env;
const User = require("../models/user");

exports.authenticate = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  const checkToken = (token) => {
    if (!token) throw handleError(401, "Not logged in..");

    try {
      const { id } = jwt.verify(token, SECRET_JWT);

      return id;
    } catch (err) {
      console.log(err.message);

      throw handleError(401, "Not logged in..");
    }
  };

  const userId = checkToken(token);

  const currentUser = await User.findById(userId);

  if (!currentUser) throw handleError(401, "Not logged in..");

  req.user = currentUser;

  next();
});



 