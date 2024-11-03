const homeController = {};

homeController.index = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }

        const queryVentas = 'SELECT SUM(cantidad) AS totalVentas FROM compras';
        const queryClientes = 'SELECT COUNT(*) AS nuevosClientes FROM login';
        const queryStock = 'SELECT SUM(cantidad_en_almacen) AS totalStock FROM productos';
        const queryPedidos = 'SELECT COUNT(*) AS pedidosPendientes FROM compras WHERE cantidad > 0'; // Ajustar según tu lógica

        connection.query(queryVentas, (err, resultVentas) => {
            if (err) {
                console.error('Error al obtener total de ventas:', err);
                return res.status(500).send('Error en el servidor');
            }

            connection.query(queryClientes, (err, resultClientes) => {
                if (err) {
                    console.error('Error al obtener número de clientes:', err);
                    return res.status(500).send('Error en el servidor');
                }

                connection.query(queryStock, (err, resultStock) => {
                    if (err) {
                        console.error('Error al obtener el stock total:', err);
                        return res.status(500).send('Error en el servidor');
                    }

                    connection.query(queryPedidos, (err, resultPedidos) => {
                        if (err) {
                            console.error('Error al obtener pedidos pendientes:', err);
                            return res.status(500).send('Error en el servidor');
                        }

                        res.render('dashboard/home', {
                            totalVentas: resultVentas[0].totalVentas || 0,
                            nuevosClientes: resultClientes[0].nuevosClientes || 0,
                            totalStock: resultStock[0].totalStock || 0,
                            pedidosPendientes: resultPedidos[0].pedidosPendientes || 0
                        });
                    });
                });
            });
        });
    });
};

module.exports = homeController;
