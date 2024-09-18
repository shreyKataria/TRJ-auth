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

// server and db connection
app.listen(port, async () => {
  try {
    const uri = process.env.DB_URI;
    await connectDB(uri);
    console.log(`connected to port ${port}`);
  } catch (error) {
    console.log(`error connecting to server at port ${port}`, error.message);
  }
});
