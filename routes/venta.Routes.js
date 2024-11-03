const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventas.Controller');

router.get('/', ventaController.venta);

module.exports = router;