const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.Controller');
const assignRole = require('../middlewares/assignRole');

// Ruta para mostrar la vista de inicio de sesión y registro
router.get('/inicio', loginController.renderLoginRegister);

// Ruta para procesar el inicio de sesión
router.post('/inicio', loginController.login);

// Ruta para procesar el registro de usuario
router.post('/registro', assignRole, loginController.register);

module.exports = router;
