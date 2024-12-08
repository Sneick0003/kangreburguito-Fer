const menuController = {};

// Función para mostrar el menú
menuController.menu = (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        // Modificamos la consulta para usar LEFT JOIN y así incluir productos sin categoría
        const query = `
            SELECT productos.id, productos.nombre, productos.descripcion, productos.precio, productos.imagen, 
                   categorias.nombre AS categoria, productos.cantidad_en_almacen
            FROM productos
            LEFT JOIN categorias ON productos.categoria_id = categorias.id
            ORDER BY categorias.nombre;
        `;

        connection.query(query, (error, results) => {
            if (error) return res.status(500).send(error);

            const menu = {};

            results.forEach(producto => {
                // Si el producto no tiene categoría, lo asignamos a "Sin categoría"
                const categoria = producto.categoria || 'Sin categoría';
                
                if (!menu[categoria]) {
                    menu[categoria] = [];
                }
                menu[categoria].push(producto);
            });

            // Enviar isAuthenticated a la vista
            res.render('menu/menu', { menu, isAuthenticated: !!req.session.userId });
        });
    });
};

// Función para agregar al carrito (sin cambios)
menuController.addToCart = (req, res) => {
    const { producto_id, usuario_id, cantidad } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ error: 'Debes estar autenticado para agregar productos al carrito' });
    }

    req.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        connection.query('SELECT cantidad_en_almacen FROM productos WHERE id = ?', [producto_id], (error, results) => {
            if (error) return res.status(500).json({ error: 'Error al verificar inventario' });

            const cantidadDisponible = results[0].cantidad_en_almacen;

            if (cantidad > cantidadDisponible) {
                return res.status(400).json({ error: 'Cantidad solicitada no disponible en inventario' });
            }

            const nuevaCantidadEnAlmacen = cantidadDisponible - cantidad;
            connection.query(
                'UPDATE productos SET cantidad_en_almacen = ?, cantidad_vendida = cantidad_vendida + ? WHERE id = ?',
                [nuevaCantidadEnAlmacen, cantidad, producto_id],
                (error) => {
                    if (error) return res.status(500).json({ error: 'Error al actualizar inventario' });

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

// Función para finalizar la compra (sin cambios)
menuController.finalizePurchase = (req, res) => {
    const { cart } = req.body;
    const userId = req.session.userId;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });

        connection.beginTransaction(err => {
            if (err) return res.status(500).json({ error: 'Error al iniciar transacción' });

            const queries = cart.map(item => {
                return new Promise((resolve, reject) => {
                    connection.query(
                        'SELECT cantidad_en_almacen FROM productos WHERE id = ?', [item.id],
                        (error, results) => {
                            if (error) return reject(error);
                            const cantidadDisponible = results[0].cantidad_en_almacen;

                            if (item.quantity > cantidadDisponible) {
                                return reject(new Error(`Stock insuficiente para ${item.nombre}`));
                            }

                            connection.query(
                                'UPDATE productos SET cantidad_en_almacen = cantidad_en_almacen - ?, cantidad_vendida = cantidad_vendida + ? WHERE id = ?',
                                [item.quantity, item.quantity, item.id],
                                (error) => {
                                    if (error) return reject(error);

                                    connection.query(
                                        'INSERT INTO compras (producto_id, usuario_id, cantidad) VALUES (?, ?, ?)',
                                        [item.id, userId, item.quantity],
                                        (error) => {
                                            if (error) return reject(error);
                                            resolve();
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            });

            Promise.all(queries)
                .then(() => {
                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ error: 'Error al finalizar transacción' });
                            });
                        }
                        res.json({ success: true });
                    });
                })
                .catch(error => {
                    connection.rollback(() => {
                        res.status(400).json({ error: error.message });
                    });
                });
        });
    });
};

module.exports = menuController;
