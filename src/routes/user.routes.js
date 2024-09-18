const express = require("express");
const {
  signup,
  login,
  logout,
  getUsers,
  refreshToken,
  searchUser,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// // test
// router.get("/", (req, res) => {
//   res.send("hello apis");
// });

// user routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/users", protect, getUsers);
router.post("/refresh-token", refreshToken);
router.get("/search-user", protect, searchUser);

module.exports = router;
