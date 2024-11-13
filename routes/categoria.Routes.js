const express = require('express');
const router = express.Router();

const categoriasController = require('../controllers/categorias.Controller');

router.get('/', categoriasController.mostrar);
router.post('/add', categoriasController.crear);
router.post('/edit/:id', categoriasController.editar);
router.delete('/delete/:id', categoriasController.eliminar);

module.exports = router;