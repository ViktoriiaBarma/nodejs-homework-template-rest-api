const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User  = require("../models/user");
const { handleError, catchAsync } = require("../utils");

const { SECRET_JWT, expiresIn } = process.env;


exports.signup = catchAsync (async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  

  const user = await User.findOne({ email });

  if (user) {
    throw handleError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

exports.login = catchAsync (async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw handleError(401, "Not authorized");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);


  if (!passwordCompare) {
    throw handleError(401, "Not authorized");
  }

  const payload = {
    id: user.id,
  };
  console.log(SECRET_JWT)

  const { subscription } = user;
    console.log(expiresIn)

  const token = jwt.sign(payload, SECRET_JWT, {
    expiresIn: "24h",
  });
  await User.findByIdAndUpdate(user.id, { token });
  res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
});


exports.getCurrent = async (req, res) => {
  const { name,email, subscription } = req.user;

  res.json({
    name,
    email,
    subscription,
  });
};

exports.logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).send();
};

// exports.subscription = async (req, res) => {
//   const { id } = req.user;
//   const { subscription } = req.body;
//   await User.findByIdAndUpdate(id, { subscription });

//   res.json({
//     id,
//     subscription,
//   });
// };


