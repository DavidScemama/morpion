const express = require("express");
const mongoose = require("mongoose");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const authentication = require('./middlewares/authentication');
const gameRouterV1 = require("./routes/v1/games");
const userRouterV1 = require("./routes/v1/users");

const app = express();
app.use(express.json());
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/tictactoe", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json",
      addPath: "./locales/{{lng}}/{{ns}}.missing.json",
    },
    fallbackLng: "en",
    preload: ["en", "fr"],
    saveMissing: true,
  });

app.use(middleware.handle(i18next));

app.use(
  negotiateFormat({
    formats: ["application/json", "text/csv"],
  })
);

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
