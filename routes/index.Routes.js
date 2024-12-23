const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.Controller');

router.get('/', indexController.index);

module.exports = router;