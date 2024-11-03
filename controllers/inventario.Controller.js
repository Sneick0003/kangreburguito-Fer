const inventarioController = {}

inventarioController.inventario = (req, res)=> {
    res.render('dashboard/inventario');

}
module.exports = inventarioController;