const User = require("../Models/UserModel");
const { createSecretToken } = require("../Util/SecretToken");
const {generateOTP, transporter, generateEmailTemplate, 
  plainEmailTemplate, plainForgotPasswordEmailTemplate} = require('../Util/EmailUtil')
const bcrypt = require("bcryptjs");
const crypto = require('crypto')
const verificationToken = require("../Models/verificationToken");
const {isValidObjectId} = require('mongoose')
require('dotenv').config()

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, username, createdAt, role });

    const OTP = generateOTP()
    const verification_Token = new verificationToken({
      owner: user._id,
      token: OTP
    })

    await verification_Token.save()

    transporter().sendMail({
      to: email,
      subject:'Confirm email',
      html: generateEmailTemplate(OTP)
  })

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, userId:user._id });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Cannot find user' }) 
    }

    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });
     next()
  } catch (error) {
    console.error(error);
  }
}

module.exports.verifyEmail = async(req,res) => {
  //1. get userId and otp from request body
  const {userId,otp} = req.body

  //2. check if body fields are populated
  if(!userId || !otp){
    return res.json({message:'Invalid request missing parameters'})
  }

  //3. check if userId is valid
  if(!isValidObjectId(userId)){
    return res.json({status:false})
  }

  //4. Find user
  const user = await User.findById(userId)

  //5. Check if user exists
  if(!user){
    return res.json({status:false})
  }

  //6. Check if user has already been verified
  if(user.verified){
    return res.json({message:'Account has already been verified'})
  }

  //7. get verification token from db
  const token = await verificationToken.findOne({owner: user._id})

  //8. Check if token exists
  if(!token){
    res.json({message:'User not found'})
  }

  //9. Check if the user has entered the correct otp
  const isMatched =  await token.compareToken(otp)

  if(!isMatched){
    return res.json({message:'invalid token'})
  }

  //10. update verified field
  user.verified = true

  //11. delete the verification token
  await verificationToken.findByIdAndDelete(token._id)
  await user.save()

  //12. Send success email
  transporter().sendMail({
    to: user.email,
    subject:'Successfully Verified',
    html: plainEmailTemplate()
  })

  res.json({success:true,message:'Successfully verified'})
}

module.exports.ForgotPassword = async(req,res,next) => {
  try{
    const {email} = req.body

    //1. get user from database
    const user = await User.findOne({email})

    //2.check is user exists
    if(!user){
      return res.json({message:'user not found'})
    }

    //3.generate random reset token
    const resetToken = user.createResetPasswordToken()

    await user.save()

    //4.send token to email
    transporter().sendMail({
      to: user.email,
      subject:'Forgot Password',
      html: plainForgotPasswordEmailTemplate(resetToken)
    })

    res.json({message:'Successfully sent forgot password email', success:true})
    next()
  }catch(e){
    user.passwordResetTokenExpires = undefined
    user.passwordResetToken = undefined
    console.log(e)
  }
}

module.exports.resetPassword = async (req, res, next) => {
  try {
    // Get the reset token and hash it
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user in database
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetTokenExpires: { $gt: Date.now() } // Use $gt operator to check expiration
    });

    // Check if user's reset token is still valid
    if (!user) {
      return res.json({ message: 'Token expired' });
    }

    // Set the new password
    user.password = req.body.password; // Assuming password is in req.body

    // Set reset token and expiration date to undefined
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    // Save the user
    await user.save();

    res.status(200).json({message:'successfully changed password', success:true})

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.adminDashboard = (req,res) => {
  // Return data for admin dashboard
  res.json({ message: 'Welcome to the admin dashboard' });
}