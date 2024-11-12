const bcrypt = require('bcrypt');

const loginController = {};

// Renderizar la vista de inicio de sesión y registro
loginController.renderLoginRegister = (req, res) => {
    res.render('login/inicio');
};

// Lógica para el inicio de sesión
loginController.login = (req, res) => {
    const { email, contra } = req.body;

    req.getConnection((error, connection) => {
        if (error) {
            console.error('Error en la conexión:', error);
            return res.status(500).send('Error de servidor');
        }

        // Consulta para obtener el usuario y su rol
        connection.query(
            `SELECT l.*, r.rol_nombre 
             FROM login l 
             JOIN usuario_roles ur ON l.id = ur.usuario_id 
             JOIN roles r ON ur.rol_id = r.id 
             WHERE l.email = ?`, 
            [email], 
            async (err, results) => {
                if (err) {
                    console.error('Error en la consulta:', err);
                    return res.status(500).send('Error de servidor');
                }

                if (results.length === 0) {
                    return res.status(401).send('Usuario o contraseña incorrectos');
                }

                const user = results[0];
                const validPassword = await bcrypt.compare(contra, user.contra);

                if (!validPassword) {
                    return res.status(401).send('Usuario o contraseña incorrectos');
                }

                // Configurar sesión con información del usuario y rol
                req.session.userId = user.id;
                req.session.userName = user.nombre;
                req.session.userRole = user.rol_nombre; // Almacenar el rol del usuario en la sesión

                // Redirigir al dashboard o a otra página según el rol
                if (user.rol_nombre === 'Admin') {
                    res.redirect('/dashboard/home');
                } else {
                    res.redirect('/'); // Puedes cambiar esta ruta a la que corresponda
                }
            }
        );
    });
};


// Lógica para el registro de usuario
loginController.register = (req, res) => {
    const { nombre, email, contra } = req.body;

    req.getConnection(async (error, connection) => {
        if (error) {
            console.error('Error en la conexión:', error);
            return res.status(500).send('Error de servidor');
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contra, salt);

            // Insertar el nuevo usuario en la base de datos
            connection.query(
                'INSERT INTO login (nombre, email, contra) VALUES (?, ?, ?)',
                [nombre, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        console.error('Error al insertar el usuario:', err);
                        return res.status(500).send('Error al registrar el usuario');
                    }

                    // Obtener el ID del nuevo usuario
                    const usuarioId = results.insertId;

                    // Asignar el rol de "Cliente" al nuevo usuario
                    connection.query(
                        'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)',
                        [usuarioId, 2], // 2 es el ID del rol "Cliente" (ajusta según tu base de datos)
                        (err, results) => {
                            if (err) {
                                console.error('Error al asignar el rol:', err);
                                return res.status(500).send('Error al asignar el rol al usuario');
                            }
                            res.redirect('/login/inicio');
                        }
                    );
                }
            );
        } catch (err) {
            console.error('Error durante el registro:', err);
            res.status(500).send('Error de servidor durante el registro');
        }
    });
};

loginController.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/'); // Redirige a la página de inicio de sesión o principal
    });
};
module.exports = loginController;
