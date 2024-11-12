// controllers/inventario.Controller.js
const controller = {};

controller.inventario = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        connection.query('SELECT * FROM productos', (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.render('dashboard/inventario', { productos: results });
        });
    });
};

controller.agregarProducto = (req, res) => {
    const { nombre, descripcion, precio, cantidad_en_almacen } = req.body;
    const imagen = req.file ? req.file.filename : null; // Procesa la imagen si está presente
    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const sql = `INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, imagen) VALUES (?, ?, ?, ?, ?)`;
        connection.query(sql, [nombre, descripcion, precio, cantidad_en_almacen, imagen], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.redirect('/dashboard/inventario');
        });
    });
};

controller.editarProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_en_almacen } = req.body;
    const imagen = req.file ? req.file.filename : null; // Procesa la imagen si está presente
    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const sql = `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad_en_almacen = ?, imagen = ? WHERE id = ?`;
        connection.query(sql, [nombre, descripcion, precio, cantidad_en_almacen, imagen, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.redirect('/dashboard/inventario');
        });
    });
};

controller.eliminarProducto = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const sql = `DELETE FROM productos WHERE id = ?`;
        connection.query(sql, [id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.redirect('/inventario');
        });
    });
};

module.exports = controller;
