const User = require("../models/user.model");
const Blacklist = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// Signup User
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user.id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    res.status(400).json({ message: "Error logging in", error: error });
  }
};

// Logout User
exports.logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  await Blacklist.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};

// Get all users with pagination
exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error fetching users", error });
  }
};

// refresh token
exports.refreshToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded);
    const user = await User.findById(decoded.userId);
    // console.log(user);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = generateToken(user);
    await user.save();

    // Respond with new tokens
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ error: error.message });
  }
};

// Search user by userId, username, or email
exports.searchUser = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "No search query provided" });
  }

  try {
    let searchCriteria;

    if (mongoose.Types.ObjectId.isValid(query)) {
      searchCriteria = { _id: query };
    } else if (query.includes("@")) {
      searchCriteria = { email: query };
    } else {
      searchCriteria = {
        username: { $regex: query, $options: "i" },
      };
    }

    const user = await User.find(searchCriteria);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDetails = user.map((name) => {
      return { name: name.username, email: name.email };
    });
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
