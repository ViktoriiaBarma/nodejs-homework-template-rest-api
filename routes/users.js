const express = require("express");

const { validateBody, authenticate, loading } = require("../middelwares");
const {  registerSchema, loginSchema, subscriptionSchema } = require("../validator/validate");


const auth = require("../controllers/auth");

const router = express.Router();


router.post("/register", validateBody(registerSchema), auth.register);

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
  loading.single("avatar"),
  auth.updateAvatar
);


module.exports = router;