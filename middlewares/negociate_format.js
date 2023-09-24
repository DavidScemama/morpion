module.exports = (options) => {
    return (req, res, next) => {
        res.format(options.formats);
        next();
    }
}