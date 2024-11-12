const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.Controller');
const authMiddleware = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación


// Ruta para mostrar el menú
router.get('/', menuController.menu);

// Ruta para agregar al carrito
router.post('/add-to-cart', authMiddleware, menuController.addToCart);

module.exports = router;
