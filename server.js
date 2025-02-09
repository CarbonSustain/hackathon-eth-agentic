const express = require("express");
const path = require("path");

const app = express();

// Serve static files from Angular's `dist` directory
app.use(express.static(path.join(__dirname, "dist/carbon-reputation-system")));

// Handle all routes and send index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/carbon-reputation-system/index.html"));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
