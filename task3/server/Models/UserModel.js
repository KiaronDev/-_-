const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  role: {
    type:String,
    enum: ['user','admin'],
    default:'user'
  },
  verified: {
    type: Boolean,
    default: false,
    required:true
  },
  passwordChangedAt: {
    type: Date,
    default: undefined
  },
  passwordResetToken: {
    type: String,
    default: undefined
  },
  passwordResetTokenExpires: {
    type: Date,
    default:undefined
  }

});

userSchema.pre("save", async function (next) {
  if(!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12);

  next()
});

userSchema.methods.createResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model("User", userSchema);