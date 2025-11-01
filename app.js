const express = require("express");
const varietyRoutes = require("./routes/variety/addVarietyRoutes");
const displayVarietyRoutes = require("./routes/variety/showVariety");
const updateVariety = require("./routes/variety/editVariety");
const deleteVariety = require("./routes/variety/deleteVariety");
const authRoutes = require("./routes/auth");

require("./db"); // Import only once (this connects automatically)

const app = express();
const port = process.env.PORT || 4012;

// Middleware
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", varietyRoutes);
app.use("/api", displayVarietyRoutes);
app.use("/api", updateVariety);
app.use("/api", deleteVariety);

// Default route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Async function to start the server
const startServer = async () => {
  try {
    // ✅ Just wait a short time to ensure DB module is loaded (optional)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ✅ Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Unable to start server:", err.message);
    process.exit(1);
  }
};

// Start the app
startServer();
