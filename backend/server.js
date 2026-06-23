require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");


const cors = require("cors");
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-travel-planner-onbz.onrender.com",
  "https://ai-travel-planner-omega-one.vercel.app"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }


      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,


  })
);

app.use(express.json());


connectDB();

app.get("/", (req, res) => {
  console.log("===> API Running...");
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