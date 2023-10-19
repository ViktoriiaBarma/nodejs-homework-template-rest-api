const express = require("express");

const { validateBody, authenticate } = require("../middelwares");
const {  registerSchema, loginSchema, subscriptionSchema } = require("../validator/validate");


const auth = require("../controllers/auth");
const upload = require("../middelwares/upload");

const router = express.Router();


router.post("/register", validateBody(registerSchema), auth.register);

router.get('/verify/:verificationToken', auth.verify);

router.post("/login", validateBody(loginSchema), auth.login);

router.get("/current", authenticate.authenticate, auth.getCurrent);

router.post("/logout", authenticate.authenticate, auth.logout);

router.patch(
  "/",
  authenticate.authenticate,
  validateBody(subscriptionSchema),
  auth.subscription
);

router.patch(
  "/avatars",
  authenticate.authenticate,
  upload.single("avatar"),
  auth.updateAvatar
);


module.exports = router;