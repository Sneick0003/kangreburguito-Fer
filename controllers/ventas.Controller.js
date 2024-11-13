const ventaController = {};

ventaController.mostrarCompras = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión a la base de datos:", err);
            return res.status(500).send("Error en la conexión a la base de datos");
        }

        const query = `
            SELECT 
                l.nombre AS usuario_nombre,
                p.nombre AS producto_nombre,
                p.precio AS precio_por_unidad,
                c.cantidad AS cantidad_producto,
                (p.precio * c.cantidad) AS precio_total,
                c.fecha_compra AS fecha_compra,
                l.id AS usuario_id
            FROM compras c
            JOIN productos p ON c.producto_id = p.id
            JOIN login l ON c.usuario_id = l.id
            ORDER BY l.nombre, c.fecha_compra;
        `;

        conn.query(query, (error, results) => {
            if (error) {
                console.error("Error al recuperar las compras:", error);
                return res.status(500).send("Error al recuperar las compras");
            }

            // Agrupamos las compras por usuario para pasarlas a la vista
            const comprasPorUsuario = results.reduce((acc, compra) => {
                if (!acc[compra.usuario_id]) {
                    acc[compra.usuario_id] = {
                        usuario_nombre: compra.usuario_nombre,
                        usuario_id: compra.usuario_id,
                        compras: []
                    };
                }
                acc[compra.usuario_id].compras.push(compra);
                return acc;
            }, {});

            res.render("dashboard/ventas", { comprasPorUsuario });
        });
    });
};

module.exports = ventaController;
