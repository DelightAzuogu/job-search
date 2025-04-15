const express = require("express");
const mongoose = require("mongoose");
const { UserRouter } = require("./route/userRoute");
const { companyRouter } = require("./route/companyRoute");
const { jobRouter } = require("./route/jobRoute");
require("dotenv").config();

const jobSearchApp = express();

jobSearchApp.use(express.json());

jobSearchApp.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

jobSearchApp.use("/user", UserRouter);
jobSearchApp.use("/company", companyRouter);
jobSearchApp.use("/job", jobRouter);

jobSearchApp.use((req, res) => {
  res.status(404).json("this route does not exist");
});

jobSearchApp.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "server Error";
  const data = err.data;
  res.status(status).json({ message, data });
});

const PORT = process.env.PORT || 3000;

jobSearchApp.listen(PORT, () => {
  mongoose.connect(process.env.MONGODB_CONNECT_STRING).then(() => {
    console.log("starting in port", PORT);
  });
});
