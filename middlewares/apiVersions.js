const apiVersions = (versions, defaultVersion) => (req, res, next) => {
    const version = req.headers['accept-version'] || defaultVersion;
    if (!versions[version]) return res.status(400).send(`Version ${version} not supported`);
    req.versionedRouter = versions[version];
    return next();
  };
  
  module.exports = apiVersions;
  