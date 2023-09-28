const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://localhost:27017/tictactoe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to the database.');
  });
};
