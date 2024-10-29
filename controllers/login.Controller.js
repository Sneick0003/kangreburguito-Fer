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

        connection.query('SELECT * FROM login WHERE email = ?', [email], async (err, results) => {
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

            // Configurar sesión
            req.session.userId = user.id;
            req.session.userName = user.nombre;
            res.redirect('/dashboard/home');
        });
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

            connection.query('INSERT INTO login (nombre, email, contra) VALUES (?, ?, ?)', [nombre, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Error al insertar el usuario:', err);
                    return res.status(500).send('Error al registrar el usuario');
                }
                res.redirect('/login/inicio');
            });
        } catch (err) {
            console.error('Error durante el registro:', err);
            res.status(500).send('Error de servidor durante el registro');
        }
    });
};

module.exports = loginController;
