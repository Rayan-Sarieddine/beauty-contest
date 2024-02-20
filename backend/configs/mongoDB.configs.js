const { default: mongoose } = require("mongoose");

const connectToMongoDB = () => {
  mongoose.connect(process.env.dbURL);
  const connection = mongoose.connection;
  connection.on("error", (error) => {
    console.log("Error connecting to database: ", error);
  });
  connection.once("open", () => {
    console.log("Connected to database");
  });
};

module.exports = { connectToMongoDB };
