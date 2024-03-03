// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number, // Ensure that price is defined as a Number type
  dateOfSale: Date,
  category: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
