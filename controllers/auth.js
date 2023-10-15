const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");

const User  = require("../models/user");
const { handleError, catchAsync } = require("../utils");

const { SECRET_JWT } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");


exports.register = catchAsync (async (req, res) => {
   const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw handleError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {

    throw handleError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (passwordCompare === false) {
    throw handleError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
  };


  const { subscription } = user;
   
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
   const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

exports.logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).send();
};

exports.subscription = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(id, { subscription });

  res.json({
    id,
    subscription,
  });
};

exports.updateAvatar = async (req, res) => {
  const { _id } = req.user;
  // console.log(req.file)
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  console.log(filename)

  Jimp.read(tempUpload, async function (err, test) {
    if (err) throw err;
    test.resize(250, 250).write(resultUpload);
    try {
      await fs.unlink(tempUpload);
    } catch (error) {
      console.error(`${tempUpload}: ${error.message}`);
    }
  });

  const avatarURL = path.join("avatars", filename);
  // console.log(avatarURL)
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};