require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("API Running...");
});

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);

const tripRoutes = require("./routes/tripRoutes");
app.use("/api/trips", tripRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});