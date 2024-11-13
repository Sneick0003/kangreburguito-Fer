const indexController = {};

indexController.index = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error en la conexión a la base de datos:", err);
            return res.status(500).send("Error en la conexión a la base de datos");
        }

        const query = `
            SELECT nombre, descripcion, precio, imagen
            FROM productos
            ORDER BY cantidad_vendida DESC
            LIMIT 3;
        `;

        conn.query(query, (error, results) => {
            if (error) {
                console.error("Error al recuperar los productos más vendidos:", error);
                return res.status(500).send("Error al recuperar los productos más vendidos");
            }

            res.render('index', { destacados: results });
        });
    });
};

module.exports = indexController;
