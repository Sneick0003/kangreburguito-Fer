const categoriasController = {}

categoriasController.categoria = (req, res) => {
    res.render('dashboard/categorias');
}
module.exports = categoriasController;