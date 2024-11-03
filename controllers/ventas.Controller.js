const ventaController = {}

ventaController.venta = (req, res) => {
    res.render('dashboard/ventas');
};

module.exports = ventaController;
