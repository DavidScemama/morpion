const express = require("express");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
    res.send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = router;
