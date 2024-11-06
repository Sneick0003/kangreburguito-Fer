// routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.Controller');


router.get('/', inventarioController.inventario);
router.post('/add', inventarioController.agregarProducto);
router.post('/editar/:id', inventarioController.editarProducto);
router.delete('/eliminar/:id', inventarioController.eliminarProducto);  // Cambiado a DELETE

module.exports = router;
