const express = require('express');
const urlRedirectingController = require('../controllers/urlRedirectingController');
const router = express.Router();

router.get(/^(?<hashVal>\/[A-Za-z0-9]{1,7})$/, urlRedirectingController.short_url_redirection);

module.exports = router;
