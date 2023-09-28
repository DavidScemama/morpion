const express = require("express");
const Game = require("../../models/Game");
const authentication = require("../../middlewares/authentication");

const router = express.Router();

router.post("/", authentication, async (req, res) => {
  try {
    const game = new Game({
      player1: req.user._id,
      board: [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ],
      currentPlayer: "X",
    });
    await game.save();
    res.status(201).send(game);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
