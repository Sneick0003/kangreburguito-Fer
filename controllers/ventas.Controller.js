const ventaController = {};

ventaController.mostrarCompras = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión a la base de datos:", err);
            return res.status(500).send("Error en la conexión a la base de datos");
        }

        const periodo = req.query.periodo || 'ano';
        const fecha = req.query.fecha || new Date().toISOString().slice(0, 10);
        let groupByTime = "YEAR(c.fecha_compra)";
        let fechaCondicion = `AND c.fecha_compra = '${fecha}'`;

        if (periodo === 'mes') {
            groupByTime = "YEAR(c.fecha_compra), MONTH(c.fecha_compra)";
            fechaCondicion = `AND MONTH(c.fecha_compra) = MONTH('${fecha}') AND YEAR(c.fecha_compra) = YEAR('${fecha}')`;
        } else if (periodo === 'semana') {
            groupByTime = "YEAR(c.fecha_compra), WEEK(c.fecha_compra)";
            fechaCondicion = `AND WEEK(c.fecha_compra) = WEEK('${fecha}') AND YEAR(c.fecha_compra) = YEAR('${fecha}')`;
        }

        const query = `
            SELECT 
                l.nombre AS usuario_nombre,
                p.nombre AS producto_nombre,
                p.precio AS precio_por_unidad,
                c.cantidad AS cantidad_producto,
                (p.precio * c.cantidad) AS precio_total,
                c.fecha_compra AS fecha_compra,
                l.id AS usuario_id,
                ${groupByTime} AS periodo
            FROM compras c
            JOIN productos p ON c.producto_id = p.id
            JOIN login l ON c.usuario_id = l.id
            WHERE 1 = 1 ${fechaCondicion}
            GROUP BY ${groupByTime}, l.id, p.id
            ORDER BY l.nombre, c.fecha_compra;
        `;

        conn.query(query, (error, results) => {
            if (error) {
                console.error("Error al recuperar las compras:", error);
                return res.status(500).send("Error al recuperar las compras");
            }

            const comprasPorUsuario = results.reduce((acc, compra) => {
                const periodoKey = `${compra.usuario_id}_${compra.periodo}`;
                if (!acc[periodoKey]) {
                    acc[periodoKey] = {
                        usuario_nombre: compra.usuario_nombre,
                        usuario_id: compra.usuario_id,
                        periodo: compra.periodo,
                        compras: []
                    };
                }
                acc[periodoKey].compras.push(compra);
                return acc;
            }, {});

            res.render("dashboard/ventas", { comprasPorUsuario: Object.values(comprasPorUsuario), fecha: fecha, periodo: periodo });
        });
    });
};


ventaController.generarCorteCaja = async (req, res) => {
    const fecha = req.query.fecha; // Obtenemos la fecha desde la query

    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión a la base de datos:", err);
            return res.status(500).send("Error en la conexión a la base de datos");
        }

        const query = `
            SELECT 
                p.nombre AS producto_nombre,
                c.cantidad AS cantidad_vendida,
                (p.precio * c.cantidad) AS total
            FROM compras c
            JOIN productos p ON c.producto_id = p.id
            WHERE DATE(c.fecha_compra) = '${fecha}'
            ORDER BY p.nombre;
        `;

        conn.query(query, (error, results) => {
            if (error) {
                console.error("Error al recuperar los datos para el corte de caja:", error);
                return res.status(500).send("Error al recuperar los datos para el corte de caja");
            }

            // Aquí generas el archivo para el corte de caja, por ejemplo, un PDF o un texto simple
            let datosCorte = 'Corte de Caja del día ' + fecha + '\n\n';
            results.forEach((item) => {
                datosCorte += `${item.producto_nombre}: Vendidos ${item.cantidad_vendida}, Total: $${item.total.toFixed(2)}\n`;
            });

            // Suponiendo que generas un archivo de texto simple
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=corte_caja_' + fecha + '.txt');
            res.send(datosCorte);
        });
    });
};


module.exports = ventaController;
