const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", authMiddleware.validateMail, (req, res) => {
  const { email, fullName, password } = req.body;
  res.status(201).json({
    data: { email, fullName, password },
  });
});

module.exports = router;
