// routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.Controller');
const upload = require('../config/multer.js'); // Importa el middleware de multer

router.get('/', inventarioController.inventario);
router.post('/add', upload.single('productImage'), inventarioController.agregarProducto);
router.post('/editar/:id', upload.single('productImage'), inventarioController.editarProducto);
router.delete('/eliminar/:id', inventarioController.eliminarProducto);

module.exports = router;
