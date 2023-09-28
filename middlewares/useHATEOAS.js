const useHATEOAS = (options) => (req, res, next) => {
    res.locals.HATEOAS = options;
    next();
  };
  
  module.exports = useHATEOAS;
  