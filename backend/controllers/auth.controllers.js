const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//real
// const sendVerificationEmail = async (user, host) => {
//   // SMTP transporter configuration
//   const transporter = nodemailer.createTransport({
//     host: "smtp.example.com", // Your SMTP server host
//     port: 587, // Your SMTP server port (587 for TLS or 465 for SSL)
//     secure: false, // True for 465, false for other ports
//     auth: {
//       user: "your_smtp_username", // Your SMTP username
//       pass: "your_smtp_password", // Your SMTP password
//     },
//   });

//   // Email content
//   const mailOptions = {
//     from: `"Beauty Contest" <no-reply@rayan.com>`, // Use your domain email
//     to: user.email,
//     subject: "Beauty Contest Email Verification",
//     html: `...` // Your HTML content here
//   };

//   // Send email
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//   } catch (error) {
//     console.error("Error sending email: ", error);
//   }
// };

//testing
const sendVerificationEmail = async (user, host) => {
  // Generate a test account dynamically
  let testAccount = await nodemailer.createTestAccount();

  // Create a transporter using ethereal email credentials
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Beauty Contest" <${testAccount.user}>`,
    to: user.email,
    subject: "Beauty contest Email Verification", // Subject line
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { background-color: #ffffff; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        h4 { color: #333333; }
        p { color: #666666; }
        a.button { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px; }
    </style>
    </head>
    <body>
        <div class="container">
            <h4>Hello, ${user.fullName}!</h4>
            <p>Thank you for registering for the Beauty Contest! We're excited to have you on board. To complete your registration and verify your email, please click the button below:</p>
            <a href="http://${host}/auth/verify?token=${user.emailVerificationToken}" class="button">Verify Email</a>
            <p>If you didn't request this, please ignore this email or notify us.</p>
        </div>
    </body>
    </html>`, // HTML body content
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.emailVerified)
      return res
        .status(400)
        .send({ message: "Invalid credentials or email not verified." });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).send({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2 days",
    });
    return res.status(200).send({
      user: { email: user.email, fullName: user.fullName },
      token,
      status: "success",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const register = async (req, res) => {
  const { email, password, fullName, userType = "USER" } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).send({ message: "All fields are required." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send({ message: "Invalid email format." });
  }

  if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    return res.status(400).send({
      message:
        "Password must be at least 8 characters long and contain at least one number.",
    });
  }

  if (!/^[A-Za-z]+ [A-Za-z]+$/.test(fullName)) {
    return res.status(400).send({
      message: "Name must include first and last name with letters only.",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(409).send({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      userType,
      emailVerificationToken,
    });
    await user.save();

    sendVerificationEmail(user, req.get("host"));

    return res.status(201).send({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
};

const verify = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).send({ message: "Invalid or expired token." });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.send({ message: "Email successfully verified." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//password reset

const sendPasswordResetEmail = async (user, host) => {
  // Create a test account on Ethereal (automatically)
  let testAccount = await nodemailer.createTestAccount();

  // Create a transporter using the Ethereal test account
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Generate a password reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  const expireTime = Date.now() + 3600000; // 1 hour
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        passwordResetToken: resetToken,
        passwordResetExpires: expireTime,
      },
    }
  );

  const mailOptions = {
    from: `"Beauty Contest" <no-reply@yourdomain.com>`,
    to: user.email,
    subject: "Password Reset Request",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
<style>
  body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f0f0f0; }
  .container { background-color: #ffffff; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
  h2 { color: #333333; }
  p { color: #666666; }
  a.button { background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; }
</style>
</head>
<body>
<div class="container">
  <h2>Password Reset Request</h2>
  <p>You're receiving this email because we received a password reset request for your account.</p>
  <p>Please click the button below to reset your password:</p>
  <a href="https://yourdomain.com/reset-password?token=${user.passwordResetToken}" class="button">Reset Password</a>
  <p>If you did not request a password reset, no further action is required.</p>
  <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
  <p><a href="https://yourdomain.com/reset-password?token=${user.passwordResetToken}">https://yourdomain.com/reset-password?token=${user.passwordResetToken}</a></p>
</div>
</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending password reset email: ", error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    await sendPasswordResetEmail(user, req.get("host"));

    res.send({
      message: "Please check your email for the password reset instructions.",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: "Password reset token is invalid or has expired." });
    }

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: "Your password has been updated." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { login, register, verify, forgotPassword, resetPassword };
