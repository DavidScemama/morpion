const i18next = require('i18next');
const middleware = require('i18next-http-middleware');

i18next
  .use(middleware.LanguageDetector)
  .init({
    resources: {
      en: require('../locales/en.json'),
      fr: require('../locales/fr.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'fr'],
  });

module.exports = (req, res, next) => {
  middleware.handle(i18next)(req, res, () => {
    next();
  });
};