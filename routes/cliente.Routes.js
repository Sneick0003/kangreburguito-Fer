const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.Controller');

router.get('/', clientesController.clientes);

module.exports = router;