-- Elimina la base de datos si existe y crea una nueva
DROP DATABASE IF EXISTS tienda_hamburguesas;
CREATE DATABASE tienda_hamburguesas;
USE tienda_hamburguesas;

-- Creación de la tabla login para los usuarios
CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    contra VARCHAR(255) NOT NULL
);

-- Creación de la tabla roles para los diferentes tipos de usuarios
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla permisos para asignar permisos a los roles
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla usuario_roles para relacionar usuarios con roles
CREATE TABLE usuario_roles (
    usuario_id INT,
    rol_id INT,
    FOREIGN KEY (usuario_id) REFERENCES login(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Creación de la tabla rol_permisos para relacionar roles con permisos
CREATE TABLE rol_permisos (
    rol_id INT,
    permiso_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
);

-- Creación de la tabla productos para los artículos en la tienda
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_en_almacen INT NOT NULL,
    cantidad_vendida INT DEFAULT 0
);

-- Creación de la tabla compras para registrar las compras realizadas por los usuarios
CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    usuario_id INT,
    cantidad INT,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES login(id)
) ENGINE = InnoDB;

-- Creación de la tabla categorias para clasificar los productos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla ofertas para registrar descuentos en productos
CREATE TABLE ofertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    descuento DECIMAL(5, 2) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Creación de la tabla imagenes para almacenar URLs de las imágenes de los productos
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Relación entre productos y categorías
ALTER TABLE productos ADD categoria_id INT;
ALTER TABLE productos ADD FOREIGN KEY (categoria_id) REFERENCES categorias(id);

-- Inserciones iniciales para roles
INSERT INTO roles (rol_nombre, descripcion)
VALUES 
    ('Admin', 'Administrador con acceso total'),
    ('Cliente', 'Cliente con acceso limitado');

-- Inserciones iniciales para permisos
INSERT INTO permisos (permiso_nombre, descripcion)
VALUES 
    ('Crear', 'Permiso para crear nuevos registros'),
    ('Leer', 'Permiso para leer registros'),
    ('Actualizar', 'Permiso para actualizar registros'),
    ('Eliminar', 'Permiso para eliminar registros');

-- Inserciones iniciales de un usuario
INSERT INTO login (nombre, email, contra)
VALUES
    ('Juan Pérez', 'juanperez@gmail.com', '1234567890');

-- Asignación del rol Admin al usuario
INSERT INTO usuario_roles (usuario_id, rol_id)
VALUES 
    (1, 1);

-- Asignación de permisos al rol Admin
INSERT INTO rol_permisos (rol_id, permiso_id)
VALUES 
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);

-- Inserciones de productos para hamburguesería
INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, cantidad_vendida)
VALUES 
    ('Hamburguesa Clásica', 'Hamburguesa con carne de res, lechuga, tomate, y queso', 50.00, 100, 25),
    ('Hamburguesa Doble', 'Hamburguesa doble con queso, lechuga y cebolla', 70.00, 80, 15),
    ('Hamburguesa Pollo', 'Hamburguesa con pechuga de pollo y mayonesa', 60.00, 50, 10),
    ('Papas Fritas', 'Papas fritas crujientes', 25.00, 200, 100),
    ('Refresco Grande', 'Refresco de 600 ml', 20.00, 150, 70),
    ('Combo Familiar', 'Combo de 3 hamburguesas y 3 refrescos', 180.00, 30, 5);

-- Inserción de una compra de ejemplo
INSERT INTO compras (producto_id, usuario_id, cantidad)
VALUES (1, 1, 2);

-- Insertar categorías para la tienda
INSERT INTO categorias (nombre, descripcion)
VALUES
    ('Hamburguesas', 'Diferentes tipos de hamburguesas'),
    ('Acompañamientos', 'Acompañamientos como papas fritas y bebidas');

-- Actualizar productos con sus respectivas categorías
UPDATE productos SET categoria_id = 1 WHERE nombre LIKE '%Hamburguesa%';
UPDATE productos SET categoria_id = 2 WHERE nombre IN ('Papas Fritas', 'Refresco Grande', 'Combo Familiar');

-- Inserción de ofertas para productos específicos
INSERT INTO ofertas (producto_id, descuento, descripcion, fecha_inicio, fecha_fin)
VALUES
    (1, 10.00, '10% de descuento en Hamburguesa Clásica', '2024-01-01 00:00:00', '2024-01-31 23:59:59');
