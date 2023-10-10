const express = require("express");

const { validateBody, authenticate } = require("../middelwares");
const {  registerSchema, loginSchema, subscriptionSchema } = require("../validator/validate");


const auth = require("../controllers/auth");

const router = express.Router();


router.post("/registr", validateBody(registerSchema), auth.registr);

router.post("/login", validateBody(loginSchema), auth.login);

router.get("/current", authenticate.authenticate, auth.getCurrent);

router.post("/logout", authenticate.authenticate, auth.logout);

router.patch(
  "/",
  authenticate.authenticate,
  validateBody(subscriptionSchema),
  auth.subscription
);

module.exports = router;
