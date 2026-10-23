const express = require('express');
const urlMappingController = require('../controllers/urlShorteningController');
const router = express.Router();

router.get('/', urlMappingController.url_mapping_list);
router.post('/fetch', urlMappingController.fetch_url_mappings);
router.get('/shorten', urlMappingController.url_mapping_create_get);
router.post('/shorten', urlMappingController.url_mapping_create_post);
router.delete('/delete/:hashVal', urlMappingController.url_mapping_delete);

module.exports = router;
