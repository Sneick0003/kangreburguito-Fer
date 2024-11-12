const menuController = {};

// Función para mostrar el menú
menuController.menu = (req, res) => {
   req.getConnection((err, connection) => {
       if (err) return res.status(500).send(err);

       const query = `
           SELECT productos.id, productos.nombre, productos.descripcion, productos.precio, productos.imagen, categorias.nombre AS categoria, productos.cantidad_en_almacen
           FROM productos
           INNER JOIN categorias ON productos.categoria_id = categorias.id
           ORDER BY categorias.nombre;
       `;

       connection.query(query, (error, results) => {
           if (error) return res.status(500).send(error);

           const menu = {};
           results.forEach(producto => {
               if (!menu[producto.categoria]) {
                   menu[producto.categoria] = [];
               }
               menu[producto.categoria].push(producto);
           });

           // Enviar isAuthenticated a la vista
           res.render('menu/menu', { menu, isAuthenticated: !!req.session.userId });
       });
   });
};

// Función para agregar al carrito
menuController.addToCart = (req, res) => {
    const { producto_id, usuario_id, cantidad } = req.body;

    // Verifica si el usuario está autenticado
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Debes estar autenticado para agregar productos al carrito' });
    }

    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        // Verificar cantidad en inventario
        connection.query('SELECT cantidad_en_almacen FROM productos WHERE id = ?', [producto_id], (error, results) => {
            if (error) return res.status(500).json({ error: 'Error al verificar inventario' });

            const cantidadDisponible = results[0].cantidad_en_almacen;

            if (cantidad > cantidadDisponible) {
                return res.status(400).json({ error: 'Cantidad solicitada no disponible en inventario' });
            }

            // Descontar del inventario y actualizar la cantidad vendida
            const nuevaCantidadEnAlmacen = cantidadDisponible - cantidad;
            connection.query(
                'UPDATE productos SET cantidad_en_almacen = ?, cantidad_vendida = cantidad_vendida + ? WHERE id = ?',
                [nuevaCantidadEnAlmacen, cantidad, producto_id],
                (error) => {
                    if (error) return res.status(500).json({ error: 'Error al actualizar inventario' });

                    // Registrar la compra en la tabla compras
                    connection.query(
                        'INSERT INTO compras (producto_id, usuario_id, cantidad) VALUES (?, ?, ?)',
                        [producto_id, req.session.userId, cantidad],
                        (error) => {
                            if (error) return res.status(500).json({ error: 'Error al registrar la compra' });

                            res.status(200).json({ message: 'Producto agregado al carrito y compra registrada' });
                        }
                    );
                }
            );
        });
    });
};

module.exports = menuController;
