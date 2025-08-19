const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/register",
  authMiddleware.validateMail,
  authController.registerUser
);

router.get("/verify", authController.verifyUser);

module.exports = router;
