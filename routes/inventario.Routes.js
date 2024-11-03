const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.Controller');

router.get('/', inventarioController.inventario);

module.exports = router;