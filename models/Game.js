const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  board: { type: Array, required: true },
  currentPlayer: { type: String, required: true },
  status: { type: String, default: "in_progress" }, // or 'completed'
});

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;
