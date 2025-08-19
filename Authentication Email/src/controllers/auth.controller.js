const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../services/mail.service");

async function registerUser(req, res) {
  const { email, password, fullName } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: "User already Exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  // send mail
  const verificationURL = `http://localhost:3000/api/auth/verify?token=${token}`;

  const mailDetails = {
    from: `Verify Email ${process.env.GMAIL_USER}`,
    to: email,
    subject: "Verify Your Email Address",
    html: `<h2 style="color:#333;">Hello ${fullName},</h2>
      <p style="font-size:16px; color:#555;">
        Please verify your email address by clicking the button below:
      </p>
      <p style="margin:30px 0;">
        <a href="${verificationURL}" 
           style="background:#4CAF50; color:#fff; padding:12px 20px; text-decoration:none; border-radius:4px; font-weight:bold;">
          Verify Email
        </a>
      </p>
      <p style="font-size:14px; color:#888;">
        Or copy and paste this link into your browser:<br>
        <a href="${verificationURL}" style="color:#4CAF50;">{{verificationURL}}</a>
      </p>`,
  };

  await transporter.sendMail(mailDetails);

  res.status(200).json({
    message: "Registered Success. Check Your Mail For Verification link",
    user: newUser,
  });
}

async function verifyUser(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const finduser = await userModel.findOneAndUpdate(
      { _id: decoded.id },
      { $set: { verified: true } }
    );
    res.status(200).send("Verification Success");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token Expired");
    }
    return res.status(401).send("Invalid Token");
  }
}

module.exports = {
  registerUser,
  verifyUser,
};
