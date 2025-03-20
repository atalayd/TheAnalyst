require("dotenv").config(); // Load environment variables

const functions = require("firebase-functions"); // ✅ Added missing import
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({
  origin: ["https://your-website.com"], // 🔹 Replace with your actual website URL
});

// ✅ Ensure Firebase is initialized correctly
if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.getStockData = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const symbol = req.query.symbol;
    if (!symbol) {
      return res.status(400).json({error: "Symbol is required"});
    }

    // ✅ Use environment variable for API key
    const apiKey = process.env.ALPHAVANTAGE_KEY;
    if (!apiKey) {
      return res.status(500).json({error: "Missing API Key"});
    }

    const baseUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY";
    const apiUrl = `${baseUrl}&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    try {
      console.log("Fetching stock data from:", apiUrl); // ✅ Debugging log
      const response = await axios.get(apiUrl);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error); // ✅ Log exact error
      res.status(500).json({error: "Failed to fetch stock data"});
    }
  });
});
