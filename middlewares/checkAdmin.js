const checkAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'Admin') {
        return next(); // Permitir acceso si el usuario es administrador
    } else {
        // Redirigir al inicio sin mostrar mensaje
        return res.redirect('/');
    }
};

module.exports = checkAdmin;
