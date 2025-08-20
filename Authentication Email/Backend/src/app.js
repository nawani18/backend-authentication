const express = require("express");
const cors = require("cors");

// routes
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());

app.use(express.json());

// use routes
app.use("/api/auth", authRoutes);
app.use("/", (req, res) => {
  res.status(200).json({
    message: "Host Success",
  });
});

module.exports = app;
