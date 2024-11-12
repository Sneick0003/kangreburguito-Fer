-- Elimina la base de datos si existe y crea una nueva
DROP DATABASE IF EXISTS tienda_hamburguesas;
CREATE DATABASE tienda_hamburguesas;
USE tienda_hamburguesas;

-- Creación de la tabla categorias primero, ya que productos depende de esta
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_en_almacen INT NOT NULL,
    cantidad_vendida INT DEFAULT 0,
    categoria_id INT,
    imagen VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Creación de la tabla login
CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    contra VARCHAR(255) NOT NULL
);

-- Creación de la tabla roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla permisos
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla usuario_roles
CREATE TABLE usuario_roles (
    usuario_id INT,
    rol_id INT,
    FOREIGN KEY (usuario_id) REFERENCES login(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Creación de la tabla rol_permisos
CREATE TABLE rol_permisos (
    rol_id INT,
    permiso_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
);

-- Creación de la tabla compras
CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    usuario_id INT,
    cantidad INT,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES login(id)
);

-- Creación de la tabla ofertas
CREATE TABLE ofertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    descuento DECIMAL(5, 2) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Inserciones iniciales para categorias
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Hamburguesas', 'Diferentes tipos de hamburguesas'),
    ('Acompañamientos', 'Acompañamientos como papas fritas y bebidas');

-- Inserciones iniciales para roles
INSERT INTO roles (rol_nombre, descripcion) VALUES
    ('Admin', 'Administrador con acceso total'),
    ('Cliente', 'Cliente con acceso limitado');

-- Inserciones iniciales para permisos
INSERT INTO permisos (permiso_nombre, descripcion) VALUES
    ('Crear', 'Permiso para crear nuevos registros'),
    ('Leer', 'Permiso para leer registros'),
    ('Actualizar', 'Permiso para actualizar registros'),
    ('Eliminar', 'Permiso para eliminar registros');

-- Inserción inicial de un usuario
INSERT INTO login (nombre, email, contra) VALUES
    ('Juan Pérez', 'juanperez@gmail.com', '1234567890');

-- Asignación de rol al usuario
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
    (1, 1);

-- Asignación de permisos al rol Admin
INSERT INTO rol_permisos (rol_id, permiso_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);

-- Inserciones iniciales de productos
INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, cantidad_vendida, categoria_id) VALUES
    ('Hamburguesa Clásica', 'Hamburguesa con carne de res, lechuga, tomate, y queso', 50.00, 100, 25, 1),
    ('Hamburguesa Doble', 'Hamburguesa doble con queso, lechuga y cebolla', 70.00, 80, 15, 1),
    ('Hamburguesa Pollo', 'Hamburguesa con pechuga de pollo y mayonesa', 60.00, 50, 10, 1),
    ('Papas Fritas', 'Papas fritas crujientes', 25.00, 200, 100, 2),
    ('Refresco Grande', 'Refresco de 600 ml', 20.00, 150, 70, 2),
    ('Combo Familiar', 'Combo de 3 hamburguesas y 3 refrescos', 180.00, 30, 5, 1);

-- Inserción de una oferta
INSERT INTO ofertas (producto_id, descuento, descripcion, fecha_inicio, fecha_fin) VALUES
    (1, 10.00, '10% de descuento en Hamburguesa Clásica', '2024-01-01', '2024-01-31');

-- Actualización de la contraseña para mayor seguridad
UPDATE login
SET contra = '$2b$10$tLzK5knW8ftXV7rB3k5OHevze2VDNquQEmSfMeqzQnW38eIGCLbV2' 
WHERE email = 'juanperez@gmail.com';
