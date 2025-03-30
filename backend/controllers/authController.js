const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const validator = require('validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
 
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Name is required');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }
 
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain both letters and numbers'
    });
  }


  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  try {
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
      message: 'Account created successfully!'
    });
  } catch (error) {
    console.error('Registration error:', error);
 
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again later.'
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
 
    if (isNaN(user.loginAttempts)) {
      user.loginAttempts = 0;
    }
 
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return res.status(403).json({
        message: `Account locked. Try again in ${remainingTime} minutes`
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) { 
      user.loginAttempts = (user.loginAttempts || 0) + 1;
 
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; 
      }

      await user.save();

      return res.status(401).json({
        message: `Invalid credentials. ${5 - user.loginAttempts} attempts remaining`
      });
    }
 
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
 
    const token = generateToken(user._id);
    res.json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const sendOtp = asyncHandler(async (req, res) => { 
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) { 
    return res.json({ success: true });
  }
 
  const otp = crypto.randomInt(100000, 999999).toString();
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpire = Date.now() + 15 * 60 * 1000;  
   
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Code',
      message: `Your OTP code is: ${otp} (expires in 15 minutes)`
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Email failed:', error);
    // Clear OTP if email fails
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email'
    });
  }
});
 
const verifyOtp = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    resetPasswordOtp: req.body.otp,
    resetPasswordOtpExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }
 
  const tempToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }  
  );
 
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    tempToken
  });
});
 
const resetPassword = asyncHandler(async (req, res) => {
  try { 
    const decoded = jwt.verify(req.body.tempToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Password reset link has expired'
      });
    }
 
    if (req.body.password.length < 8) {
      return res.status(422).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (!/\d/.test(req.body.password) || !/[a-zA-Z]/.test(req.body.password)) {
      return res.status(422).json({
        success: false,
        message: 'Password must contain both letters and numbers'
      });
    }
 
    user.password = req.body.password;
    await user.save();

    // Return new token
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token
    });

  } catch (err) {
    console.error('Password reset error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Password reset link has expired'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid password reset link'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword
};