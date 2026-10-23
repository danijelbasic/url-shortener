const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config');

const UrlMappingSchema = new Schema({
  id: {type: Number, required: true},
  originalUrl: {type: String, required: true, trim: true},
  shortUrl: {type: String, required: true, trim: true},
  clicksNum: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
});

UrlMappingSchema.index({ originalUrl: 1 });

UrlMappingSchema.virtual("shortUrlWithDomain").get(function() {
  return `${config.domain}${this.shortUrl}`;
});

module.exports = mongoose.model('UrlMapping', UrlMappingSchema);
