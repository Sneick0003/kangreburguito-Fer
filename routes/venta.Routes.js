const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventas.Controller');

// Ruta existente que muestra las compras
router.get('/', ventaController.mostrarCompras);

router.get('/generar-corte', ventaController.generarCorteCaja);


module.exports = router;
