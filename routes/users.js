const auth = require("../middleware/auth");
const hasRole = require("../middleware/hasRole");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", [auth, hasRole(["admin", "moderator"])], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("auth-token", token).send({ name, email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
