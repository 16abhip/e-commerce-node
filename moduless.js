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
const {createProxyMiddleware} = require('http-proxy-middleware');
const app = express();
const port = 8000;
const ObjectId = mongoose.Types.ObjectId;
app.use(express.json());
app.use('/api', createProxyMiddleware({
  target: 'https://tiny-blue-oyster.cyclic.app',
  changeOrigin: true,
}));
module.exports = { express, User, Product, mongoose, app, port, ObjectId, userAdder, productAdder };
