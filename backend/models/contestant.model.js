const mongoose = require("mongoose");

const contestantSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      unique: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Contestant = mongoose.model("Contestant", contestantSchema);
module.exports = Contestant;
