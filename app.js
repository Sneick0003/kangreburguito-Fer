const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql');
const myConnection = require('express-myconnection');

const app = express();

// Configuración de la conexión a la base de datos con `express-myconnection`
const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'tienda_hamburguesas'
};

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración del middleware de conexión antes de las rutas
app.use(myConnection(mysql, dbOptions, 'pool'));

// Middleware para parsear formularios y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Configuración de la sesión
app.use(session({
    secret: 'Fernandito',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a `secure: true` solo si usas HTTPS
}));

// Middleware para hacer que isAuthenticated esté disponible en todas las vistas
app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.userId;
    next();
});
const authMiddleware = require('./middlewares/checkAdmin.js'); // Middleware de autenticación


// Rutas públicas
app.use('/', require('./routes/index.Routes')); // Ruta para la vista principal
app.use('/kangreburguito-Fer/menu', require('./routes/menu.Routes')); // Ruta para la vista de menu
app.use('/login', require('./routes/login.Routes')); // Ruta para la vista de login


//rutas protegida 
app.use('/dashboard', authMiddleware, require('./routes/home.Routes')); // Ruta para la vista de home
app.use('/dashboard/ventas', authMiddleware, require('./routes/venta.Routes')); // Ruta para la vista de ventas
app.use('/dashboard/inventario', authMiddleware, require('./routes/inventario.Routes')); // Ruta para la vista de inventario
app.use('/dashboard/clientes', authMiddleware, require('./routes/cliente.Routes'));
app.use('/dashboard/categorias', authMiddleware, require('./routes/categoria.Routes'));

// // Manejo de errores 404
// app.use((req, res) => {
//     res.status(404).render('status');  // Asegúrate de tener una vista 'status.ejs' en tu carpeta de vistas
// });

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
