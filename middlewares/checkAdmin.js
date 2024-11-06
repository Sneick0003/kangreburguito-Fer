const checkAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'Admin') {
        // Permitir acceso si el usuario tiene el rol de administrador
        return next();
    } else {
        // Redirigir o enviar un mensaje si el usuario no tiene permiso
        return res.status(403).send('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
    }
};

module.exports = checkAdmin;
