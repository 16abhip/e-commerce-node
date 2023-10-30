const express = require("express");
const {
  User,
  Product,
  userAdder,
  productAdder,
  mongoose,
} = require("./mongocon");

//trwDq9IaYq30IJOk
const app = express();
const port = 8000;
const ObjectId = mongoose.Types.ObjectId;
app.use(express.json());
module.exports = { express, User, Product, mongoose, app, port, ObjectId, userAdder, productAdder };
