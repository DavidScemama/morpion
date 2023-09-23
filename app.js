const express = require('express');
const mongoose = require('mongoose');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');


// Initialisation d'Express
const app = express();
app.use(express.json());

// Configuration de la base de données
mongoose.connect('mongodb://localhost:27017/tictactoe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Configuration de i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
      addPath: './locales/{{lng}}/{{ns}}.missing.json',
    },
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    saveMissing: true,
  });

// Middleware pour la gestion de la traduction
app.use(middleware.handle(i18next));

// Middleware pour la négociation de format
app.use(negotiateFormat({
  formats: ['application/json', 'text/csv']
}));

// Middleware pour le versioning
app.use('/games', apiVersions({
  v1: gameRouterV1,
}, 'v1'));

app.use('/users', apiVersions({
  v1: userRouterV1,
}, 'v1'));

// Middleware pour l'authentification
app.use(authentication);

// Middleware pour HATEOAS
app.use(useHATEOAS({
  pagination: true,
  links: {
    self: {},
    update: {
      type: 'PUT',
    },
    games: {
      path: '/games',
    },
  }
}));

// Lancement du serveur
app.listen(3000, () => console.log('Listening on port 3000'));