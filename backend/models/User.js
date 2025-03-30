const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false  
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
 
  resetPasswordOtp: {
    type: String,
    select: false
  },
  resetPasswordOtpExpire: {
    type: Date,
    select: false
  }, 
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lockUntil: {
    type: Date
  }, 
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  }, 
  otpAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lastOtpAttempt: {
    type: Date,
    select: false
  }, 
  avatar: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
 
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
 
UserSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > Date.now();
});
  
UserSchema.methods.matchPassword = async function(enteredPassword) {
 
  if (!enteredPassword || typeof enteredPassword !== 'string') {
    throw new Error('Password is required and must be a string');
  }
   
  if (!this.password) {
    throw new Error('User password is not set');
  }

  return await bcrypt.compare(enteredPassword, this.password);
}; 
UserSchema.methods.incrementLoginAttempts = async function() { 
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
   
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };  
  }
  
  return await this.updateOne(updates);
};
 
UserSchema.methods.resetLoginAttempts = async function() {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};
 
UserSchema.index({ email: 1 });
UserSchema.index({ lockUntil: 1 });
UserSchema.index({ emailVerificationToken: 1 });

module.exports = mongoose.model('User', UserSchema);