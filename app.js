const express = require("express");
const mongoose = require("mongoose");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const authentication = require('./middlewares/authentication');
const gameRouterV1 = require("./routes/v1/games");
const userRouterV1 = require("./routes/v1/users");
const initializeMongoose = require('./config/mongoose');
const initializePassport = require('./config/passport');
const apiVersions = require('./middlewares/apiVersions');
const useHATEOAS = require('./middlewares/useHATEOAS');
const negociateFormat = require('./middlewares/negociate_format');
const negociateTrad = require('./middlewares/negociate_trad');


const app = express();
app.use(express.json());
require('dotenv').config();
initializeMongoose();
initializePassport();


mongoose.connect("mongodb://localhost:27017/tictactoe", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(negociateTrad);

app.use(
  negociateFormat({
    formats: ["application/json", "text/csv"],
  })
);

app.get('/', (req, res) => {
    const welcomeMessage = req.t('welcome');
    res.send(welcomeMessage);
});

app.use(
  "/games",
  apiVersions(
    {
      v1: gameRouterV1,
    },
    "v1"
  )
);

app.use(
  "/users",
  apiVersions(
    {
      v1: userRouterV1,
    },
    "v1"
  )
);

app.use(authentication);

app.use(
  useHATEOAS({
    pagination: true,
    links: {
      self: {},
      update: {
        type: "PUT",
      },
      games: {
        path: "/games",
      },
    },
  })
);

app.listen(3000, () => console.log("Listening on port 3000"));
