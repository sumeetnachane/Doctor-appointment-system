const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

//dotenv config
dotenv.config();

//MongoDB connection
connectDB();

//rest object
const app = express();

//Middleware
app.use(express.json());
app.use(moragan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//static path
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//routes
app.get("/", (req, res) => {
  res.status(201).send({
    message: "Server Running",
  });
});

//port
const port = process.env.PORT || 8080;

//Port Listen
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
