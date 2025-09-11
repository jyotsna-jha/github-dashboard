// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for your Vite app
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Route: Exchange GitHub code for access token
app.get("/api/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const response = await axios({
      url: "https://github.com/login/oauth/access_token",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.VITE_GITHUB_CLIENT_SECRET,
        code,
      },
    });

    const { access_token } = response.data;

    if (access_token) {
      return res.json({ token: access_token });
    } else {
      return res.status(400).json({ error: "Failed to get access token" });
    }
  } catch (err) {
    console.error("Token exchange failed:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to authenticate with GitHub" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`💡 Make sure your frontend runs on http://localhost:5173`);
});