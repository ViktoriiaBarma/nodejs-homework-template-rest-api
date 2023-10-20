const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const uuid = require('uuid').v4;
const fs = require("fs").promises;
const Jimp = require("jimp");

const User  = require("../models/user");
const { handleError, catchAsync, sendEmail } = require("../utils");


const { SECRET_JWT, BASE_URL} = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");


exports.register = catchAsync (async (req, res) => {
   const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw handleError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = uuid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
  }

  await sendEmail(verifyEmail)

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

exports.verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw handleError(404, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

  res.json({
    message: 'Verification successful',
  });
};

exports.resendVerify = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw handleError(404, 'User not found');
  }
  if (user.verify) {
    throw handleError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verification email sent',
  });
};

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw handleError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw handleError(401, "Email not verify");
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

  if (req.file === undefined) {
    res.status(400).json(
{     message: 'File not downloaded'
}    )
  } else {
    const { path: destination, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    Jimp.read(destination, async function (err, test) {
      if (err) throw err;
      test.resize(250, 250).write(resultUpload);
      try {
        await fs.unlink(destination);
      } catch (error) {
        console.error(`${destination}: ${error.message}`);
      }
    });

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  }
};