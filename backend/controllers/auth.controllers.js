const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const sendVerificationEmail = async (user, host) => {
  // Generate a test account dynamically
  let testAccount = await nodemailer.createTestAccount();

  // Create a transporter using ethereal email credentials
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // Ethereal user
      pass: testAccount.pass, // Ethereal password
    },
    tls: {
      rejectUnauthorized: false, // Only use this for development!
    },
  });

  const mailOptions = {
    from: `"Your Name" <${testAccount.user}>`, // Sender address
    to: user.email, // List of receivers
    subject: "Email Verification", // Subject line
    html: `<h4>Hello, ${user.fullName}</h4>
           <p>Please verify your email by clicking on the link below:</p>
           <a href="http://${host}/auth/verify?token=${user.emailVerificationToken}">Verify Email</a>`, // HTML body content
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

module.exports = { login, register, verify };
