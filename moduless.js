const express = require("express");
const {
  User,
  Product,
  userAdder,
  productAdder,
  mongoose,
} = require("./mongocon");
// mongodb+srv://abhip:trwDq9IaYq30IJOk@cluster0.gybwhw7.mongodb.net/
//trwDq9IaYq30IJOk
const cors = require('cors');
const app = express();
app.use(cors());
const port = 8000;
const ObjectId = mongoose.Types.ObjectId;
app.use(express.json());

module.exports = { express, User, Product, mongoose, app, port, ObjectId, userAdder, productAdder };
