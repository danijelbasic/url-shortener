const UrlMapping = require('../models/urlMapping');
const shortUrlCharMap = require('./shortUrlCharMap');
const generateNumericId = require('./idGenerator');
const debug = require('debug')('url-shortener:service');

exports.fetch_url_mappings = async (draw, start, length, searchValue) => {
    const totalRecordsNum = await UrlMapping.estimatedDocumentCount();

    let searchFilter = {};
    if (searchValue) {
      // Case-insensitive regex search across multiple fields
      const searchRegex = new RegExp(searchValue, 'i');
      searchFilter = {
        originalUrl: searchRegex
      };
    }

    debug(`Search filter: ${searchFilter.originalUrl}`);

    const recordsFiltered = await UrlMapping.countDocuments(searchFilter);

    const allMappings = await UrlMapping.find(searchFilter,
        "originalUrl shortUrl clicksNum createdAt")
    .sort({createdAt: -1})
    .skip(start)
    .limit(length)
    .lean();

    return {
      draw,
      recordsTotal: totalRecordsNum,
      recordsFiltered: recordsFiltered,
      data: allMappings
    };
};

exports.create = async (originalUrl) => {
  const existingMapping = await getByOriginalUrl(originalUrl);
  if (existingMapping) {
    debug(`The short URL already exists for ${originalUrl}: ${existingMapping.shortUrl}`);
    return {
      urlMapping: existingMapping,
      exists: true
    };
  }

  const id = generateNumericId();
  const base62Id = convertToBase62(id);
  debug(`Generated base62 number for ${id}: ${base62Id}`);
  const urlMapping = new UrlMapping({
    originalUrl: originalUrl,
    // let's keep short URLs without domain. It will be easier to migrate to the new domain
    shortUrl: `/${base62Id}`,
    id: id
  });
  await urlMapping.save();
  debug(`Created short URL for ${originalUrl}: ${urlMapping.shortUrl}`);
  return {
    urlMapping: urlMapping,
    exists: false
  };
};

exports.delete = async (hashVal) => {
  const shortUrl = `/${hashVal}`;
  debug(`Deleting short URL: ${shortUrl}`);
  return await UrlMapping.findOneAndDelete({shortUrl: shortUrl}).exec();
};

async function getByOriginalUrl (originalUrl) {
  return await UrlMapping.findOne({originalUrl: originalUrl}).exec();
}

function convertToBase62(id) {
  const shortUrlChars = [];

  let base10Num = BigInt(id);
  const targetBase = 62n;
  while (base10Num > 0) {
    shortUrlChars.push(shortUrlCharMap[base10Num % targetBase]);
    base10Num /= targetBase;
  }

  return shortUrlChars.reverse().join('');
}

