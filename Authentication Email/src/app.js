const express = require("express");

// routes
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

// use routes
app.use("/api/auth", authRoutes);

module.exports = app;
