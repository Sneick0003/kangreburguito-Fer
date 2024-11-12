// middlewares/authMiddleware.js
module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        // Si el usuario está autenticado, continua con la siguiente función
        return next();
    } else {
        // Si no está autenticado, redirige a la página de inicio de sesión
        return res.redirect('/login/inicio'); // Cambia a la ruta de inicio de sesión si es necesario
    }
};
