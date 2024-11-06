const assignRole = (req, res, next) => {
    // Verifica si el rol está presente en la solicitud, si no, asigna el rol de "cliente"
    if (!req.body.rol) {
        req.body.rol = 'cliente';
    }
    next();
};

module.exports = assignRole;
