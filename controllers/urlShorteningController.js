const UrlMapping = require('../models/urlMapping');
const urlMappingService = require('../services/urlMappingService');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('url-shortener:shortening-controller');

exports.url_mapping_list = async (req, res, next) => {
  res.render('index');
};

exports.fetch_url_mappings = async (req, res, next) => {
  try {
    const draw = parseInt(req.body.draw) || 1;
    const start = parseInt(req.body.start) || 0;
    const length = parseInt(req.body.length) || 10;
    const searchValue = req.body.search?.value || '';

    const result = await urlMappingService.fetch_url_mappings(draw, start, length, searchValue);
    debug(`Search has been successfully fetched for the search term ${searchValue}`);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
};

exports.url_mapping_create_get = async (req, res, next) => {
  res.render("short_url_form");
};

exports.url_mapping_create_post = [
  // Validate and sanitize the name field.
  body("originalUrl")
  .isURL({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  })
  .withMessage("Please enter a valid HTTP or HTTPS URL"),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const errors = validationResult(req);
    let urlMapping = new UrlMapping({originalUrl: req.body.originalUrl});
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("short_url_form", {
        urlMapping,
        errors: errors.array()
      });
      return;
    }

    urlMapping = await urlMappingService.create(req.body.originalUrl);
    debug(`Created short URL for ${req.body.originalUrl}: ${urlMapping.shortUrl}`);
    res.render("short_url_form", urlMapping);
  }
];

exports.url_mapping_delete = async (req, res, next) => {
  const hashVal = req.params.hashVal;
  try{
    const mappingDeleted = await urlMappingService.delete(hashVal);
    if(!mappingDeleted) {
      debug(`No mapping found with hashVal: ${hashVal}`);
      return res.status(404).json({
        message: `No mapping found with hashVal: ${hashVal}`
      });
    }

    debug(`Deleted mapping with hashVal: ${hashVal}`);
    return  res.status(200).json({
      success: true,
      message: `Deleted mapping with hashVal: ${hashVal}`
    });
  } catch (err) {
    console.error(err);
  }
  return res.status(500).json({
    message: `An internal server error occurred while deleting the mapping ${hashVal}.`
  });

};
