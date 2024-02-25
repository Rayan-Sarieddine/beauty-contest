const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "default-user.png",
    },
    votedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contestant",
      default: null,
    },
    userType: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: "" },
    passwordResetToken: {
      type: String,
      default: "",
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
