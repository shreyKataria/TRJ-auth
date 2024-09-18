require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/dbConfig");
const routes = require("./src/routes/router");

const app = express();

const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());

// router
app.use(routes);

// db connection
const uri = process.env.DB_URI;
connectDB(uri);

// server and db connection

const Server = app.listen(port, () => {
  if (process.env.NODE_ENV !== "test") {
    try {
      console.log(`Server is running on port ${port}.`);
    } catch (error) {
      console.error("error in connecting to server ", error);
      process.exit(1);
    }
  }
});

// server();
// Export app for testing
module.exports = { app, Server };
