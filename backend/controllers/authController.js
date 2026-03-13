const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/emailService");

console.log("--- AUTH CONTROLLER LOADED (V4 - 2FA & RESET) ---");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret_123", { expiresIn: "30d" });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = async (req, res) => {
  console.log("Register Body:", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      const field = userExists.email === email ? "Email" : "Username";
      return res.status(400).json({ message: `${field} already exists` });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpires,
      isVerified: false,
    });

    if (user) {
      try {
        console.log(`Attempting to send OTP email to: ${user.email}`);
        await sendEmail({
          email: user.email,
          subject: "Your OTP for Account Verification",
          message: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        });
        console.log(`OTP email sent successfully to: ${user.email}`);

        res.status(201).json({
          message: "Registration successful. Please check your email for OTP.",
          email: user.email,
        });
      } catch (emailError) {
        console.error("OTP Email Error:", emailError);
        res.status(201).json({
          message: "User registered but failed to send OTP email. Please try resending OTP.",
          email: user.email,
        });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(`Verifying OTP for: ${email}`);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send "Login Successful" email
    try {
      await sendEmail({
        email: user.email,
        subject: "Login Successful - Cricket Arena",
        message: `Hello ${user.username}, you have successfully logged in to your Cricket Arena account.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #007bff;">Welcome back, ${user.username}!</h2>
            <p>You have successfully logged in to <strong>Cricket Arena</strong>.</p>
            <p>Explore the latest cricket stats, live scores, and AI-powered insights.</p>
            <br />
            <p>Best regards,<br />The Cricket Arena Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Login Success Email Error:", emailError);
    }

    res.status(200).json({
      message: "Account verified successfully",
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Acts as email or username
  console.log(`LOGIN TRIGGERED for: ${email}`);
  try {
    const user = await User.findOne({ 
      $or: [
        { email: email },
        { username: email }
      ] 
    });

    if (user && (await user.comparePassword(password))) {
      console.log(`Password Match! Generating 2FA OTP for: ${user.email}`);
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      try {
        await sendEmail({
          email: user.email,
          subject: "Your Login OTP - Cricket Arena",
          message: `Your login OTP is ${otp}. It will expire in 10 minutes.`,
        });
        console.log(`2FA OTP sent to: ${user.email}`);
      } catch (emailError) {
        console.error("Login OTP Email Error:", emailError);
      }

      return res.status(200).json({
        message: "OTP sent to your email. Please verify to continue.",
        otpRequired: true,
        email: user.email,
      });
    } else {
      console.log("Login failed: Invalid credentials");
      res.status(401).json({ message: "Invalid email/username or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP - Cricket Arena",
      message: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your OTP for Account Verification",
      message: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};