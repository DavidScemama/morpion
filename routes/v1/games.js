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

router.post("/:id/join", authentication, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).send("Game not found");
    if (game.player2) return res.status(400).send("Game already full");
    game.player2 = req.user._id;
    await game.save();
    res.send(game);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id/move", authentication, async (req, res) => {
  try {
    const { x, y } = req.body;
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).send("Game not found");
    if (![game.player1, game.player2].includes(req.user._id.toString()))
      return res.status(401).send("Unauthorized move");
    if (game.board[x][y] !== " ") return res.status(400).send("Invalid move");
    game.board[x][y] = game.currentPlayer;
    game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
    await game.save();
    res.send(game);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id/status", authentication, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).send("Game not found");
    res.send({
      board: game.board,
      currentPlayer: game.currentPlayer,
      status: game.status,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/", authentication, async (req, res) => {
  try {
    const games = await Game.find({
      $or: [{ player1: req.user._id }, { player2: req.user._id }],
    });
    res.send(games);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
