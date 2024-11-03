const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.Controller');

router.get('/', categoriasController.categoria);

module.exports = router;