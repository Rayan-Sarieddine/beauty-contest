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
    votedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contestant",
      default: null,
    },
    userRole: {
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userschema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
