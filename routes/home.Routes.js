const express = require('express');
const router = express.Router();
const homeController = require('../controllers/Home.Controller');
const authMiddleware = require('../middlewares/checkAdmin.js'); // Middleware de autenticación
const assignRole = require('../middlewares/assignRole');



router.get('/home', assignRole, authMiddleware, homeController.index);

module.exports = router;
