const express = require("express");
const router = express.Router();
const axios = require("axios");
const Transaction = require("../models/transaction.models");

// Initialize Database with Seed Data
router.post("/initialize-database", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;
    // Insert transactions into database
    await Transaction.insertMany(transactions);

    res.json({ success: true, message: "Database initialized successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// List All Transactions
router.get("/transactions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const searchText = req.query.searchText || "";
    const month = req.query.month || ""; // Add month parameter

    // Build the search query
    const searchQuery = {
      $or: [
        { title: { $regex: searchText, $options: "i" } }, // Use $regex to match case-insensitive text
        { description: { $regex: searchText, $options: "i" } },
        { price: { $regex: searchText, $options: "i" } }, // Assuming price is stored as a string in the database
      ],
    };

    // Add month filter if provided
    if (month) {
      const startOfMonth = new Date(`${month}-01`);
      const endOfMonth = new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ); // Last day of the month
      searchQuery.dateOfSale = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const transactions = await Transaction.find(searchQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
module.exports = router;
