// Import Modules
// Import user model for database operations
// Import bcrypt for password hashing and comparison
// Import JWT for token generation and verification
// Import mail service for sending emails
const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../services/mail.service");

// Register User
async function registerUser(req, res) {
  const { email, password, fullName } = req.body; // Extract email, password, and fullName from request body

  const userExists = await userModel.findOne({ email }); // Check if user already exists with same email

  if (userExists) {
    return res.status(409).json({
      message: "User already Exists", // If user exists, send error response
    });
  }

  const hashPassword = await bcrypt.hash(password, 10); // Hash user password before saving

  const newUser = await userModel.create({
    email,
    password: hashPassword,
    fullName,
  }); // Create new user in database

  // Generate email verification token with 10 min expiration
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  // Create verification link with token
  const verificationURL = `http://localhost:5173/verify/${token}`;

  // Mail details for sending verification email
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

  await transporter.sendMail(mailDetails); // Send verification email

  res.status(200).json({
    message: "Registered Success. Check Your Mail For Verification link", // Success response
    user: newUser,
  });
}

// Verify User
async function verifyUser(req, res) {
  const { token } = req.query; // Extract token from request query

  if (!token) {
    return res.status(400).json({ message: "Token is required" }); // If no token, return error
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token validity

    const userData = await userModel.findById(decoded.id); // Find user using token payload id

    if (!userData) {
      return res.status(404).json({ message: "Token Expired" }); // If user not found, token expired
    }

    if (userData.isVerified) {
      return res.status(201).json({ message: "User Already Verified" }); // If user already verified
    }

    userData.isVerified = true; // Mark user as verified
    await userData.save(); // Save changes
    res.status(200).json({ message: "Verification Success" }); // Send success response
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" }); // Handle expired token
    }
    return res.status(401).json({ message: "Invalid Token" }); // Handle invalid token
  }
}

// Login User
async function loginUser(req, res) {
  const { email, password } = req.body; // Extract email and password from request body

  const userExists = await userModel.findOne({ email }); // Check if user exists

  if (!userExists) {
    return res.status(404).json({
      message: "User Not Exists", // If user does not exist
    });
  }

  const decodePassword = await bcrypt.compare(password, userExists.password); // Compare entered password with hashed password
  if (!decodePassword) {
    return res.status(401).json({
      message: "Invalid Password", // Wrong password
    });
  }

  const verifyedUser = userExists.isVerified; // Check if user verified
  if (!verifyedUser) {
    return res.status(403).json({
      message: "User Not verifyed", // User not verified
    });
  }

  // Generate login token valid for 30 days
  const loginToken = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", loginToken); // Set token in cookie

  res.status(200).json({
    message: "Login Success", // Success response
  });
}

// Resend Verification Link
async function resendLink(req, res) {
  const { email } = req.body; // Extract email from request body

  if (!email) {
    return res.status(400).json({
      message: "Email is Required", // If email not provided
    });
  }

  try {
    const user = await userModel.findOne({ email }); // Find user by email

    if (!user) {
      return res.status(404).json({
        message: "User Not Found", // If user not found
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        message: "User Already Verifyed", // If already verified
      });
    }

    // Generate new verification token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const verificationURL = `http://localhost:5173/verify/${token}`;

    // Mail details for resending verification email
    const mailDetails = {
      from: `Verify Email ${process.env.GMAIL_USER}`,
      to: email,
      subject: "Verify Your Email Address",
      html: `<h2 style="color:#333;">Hello ${user.fullName},</h2>
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
        <a href="${verificationURL}" style="color:#4CAF50;">${verificationURL}</a>
      </p>`,
    };

    await transporter.sendMail(mailDetails); // Send verification mail again
    res.status(200).json({ message: "Verification Email Sent Again" }); // Success response
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error", // Handle server errors
    });
  }
}

// Export all functions for use in routes
module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  resendLink,
};
