const nodemailer = require('nodemailer')
require('dotenv').config()

exports.transporter = () => nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user: process.env.USER,
        pass:process.env.PASSWORD,
    },
    tls:{
        rejectUnauthorized: false
    }
})




    exports.generateOTP = () => {
      let otp = ''
      for(let i = 0;i < 5; i++){
        const randVal = Math.round(Math.random() * 9)
        otp = otp + randVal
      }

      return otp
    }

exports.generateEmailTemplate = (code) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>One-Time Password (OTP) Email</title>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>One-Time Password (OTP) Email</h2>
        <p>You have requested a One-Time Password (OTP) to verify your email address.</p>
        <p>Your OTP is: ${code}</p>
        <p>If you did not request this OTP, you can ignore this email.</p>
        <p>Thank you,<br>Your App Team</p>
      </div>
    </body>
    </html>
    
    `
}

exports.plainEmailTemplate =() => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification Success</title>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification Success</h2>
        <p>Your email address has been successfully verified. You can now access your account and enjoy our services.</p>
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
        <p>Thank you for choosing us!<br>Your App Team</p>
      </div>
    </body>
    </html>
    `
}

exports.plainForgotPasswordEmailTemplate = (token) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
  </head>
  <body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Forgot Your Password?</h2>
      <p>We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
      <p>To reset your password, click on the following link:</p>
      <p><a href="http://localhost:3001/reset-password/${token}">Reset Password</a></p>
      <p>This link is valid for a limited time for security reasons. If you don't use it within this period, you'll need to request a new password reset.</p>
      <p>If you have any questions or need further assistance, please feel free to contact us.</p>
      <p>Thank you!<br>Your App Team</p>
    </div>
  </body>
  </html>
  `;
};
