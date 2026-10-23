const UrlMapping = require('../models/urlMapping');
const debug = require('debug')('url-shortener:redirecting-controller');

exports.short_url_redirection = async (req, res, next) => {
  const shortUrl = req.params.hashVal;
  const existingMapping = await UrlMapping.findOne({shortUrl: shortUrl}).exec();
  if(existingMapping) {
    debug(`Redirecting ${shortUrl} => ${existingMapping.originalUrl}`);
    existingMapping.$inc('clicksNum', 1);
    await existingMapping.save();
    res.redirect(existingMapping.originalUrl);
  } else {
    debug(`URL not found for ${shortUrl}`);
    res.sendStatus(404);
  }
};
