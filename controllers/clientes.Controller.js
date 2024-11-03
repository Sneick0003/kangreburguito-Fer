const clientesController = {}

clientesController.clientes = (req, res) => {
    res.render('dashboard/clientes');
};
module.exports = clientesController;