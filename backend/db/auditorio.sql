-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-10-2025 a las 15:56:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `auditorio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `artistas`
--

CREATE TABLE `artistas` (
  `id_artista` int(11) NOT NULL,
  `nombre_artista` varchar(100) NOT NULL,
  `genero` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen_artista` varchar(512) DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Suspendido','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `artistas`
--

INSERT INTO `artistas` (`id_artista`, `nombre_artista`, `genero`, `descripcion`, `imagen_artista`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Camila', 'Pop latino', 'Se caracteriza por tocar un estilo musical que combina varios géneros, principalmente pop latino, pop rock, balada romántica y rock latino, con influencias adicionales de urbano, reggae, blues rock, power ballad, piano rock y música regional mexicana.', NULL, 'Activo', '2025-10-03 17:03:20', '2025-10-03 17:09:35'),
(3, 'Rammstein', 'Heavy metal', 'Ola crayola', NULL, 'Activo', '2025-10-03 17:05:51', '2025-10-03 17:05:51'),
(4, 'Three Days Grace', 'Heavy Metal', 'Ya no esta borradooo.', NULL, 'Activo', '2025-10-03 17:06:58', '2025-10-09 20:07:54'),
(5, '123', 'Heavy metal', 'Rock', NULL, 'Activo', '2025-10-06 15:42:36', '2025-10-06 15:42:36'),
(7, '1234', 'Heavy metal', 'Rock', NULL, 'Activo', '2025-10-06 15:43:43', '2025-10-06 15:43:43'),
(8, 'Don Omar', 'Regueton', 'Aja', NULL, 'Activo', '2025-10-09 20:08:17', '2025-10-09 20:08:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asientos`
--

CREATE TABLE `asientos` (
  `id_asiento` int(11) NOT NULL,
  `seccion_id` int(11) NOT NULL,
  `fila` char(1) NOT NULL,
  `numero_asiento` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo','Pendiente') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asientos`
--

INSERT INTO `asientos` (`id_asiento`, `seccion_id`, `fila`, `numero_asiento`, `estado`, `created_at`, `updated_at`) VALUES
(3, 2, 'A', 1, 'Activo', '2025-10-04 04:40:33', '2025-10-04 04:40:33'),
(4, 3, 'B', 1, 'Activo', '2025-10-04 04:46:59', '2025-10-09 20:09:07'),
(6, 2, 'A', 2, 'Activo', '2025-10-09 19:57:32', '2025-10-09 19:57:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditorios`
--

CREATE TABLE `auditorios` (
  `id_auditorio` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `imagen_auditorio` varchar(512) DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auditorios`
--

INSERT INTO `auditorios` (`id_auditorio`, `nombre`, `capacidad`, `direccion`, `imagen_auditorio`, `estado`, `created_at`, `updated_at`) VALUES
(3, 'Auditorio Villa Hermosa', 3000, 'Villa Hermosa #440 Av. de la Paz', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-04 05:03:22'),
(4, 'Auditorio 4', 100, 'Mi casa', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(5, 'Auditorio 5', 1000, 'Av. Boulevard #115', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(6, 'Auditorio Lopez Doriga', 90000, 'Lalala', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(7, 'Edicion 1', 10, 'Edificio 1.1', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(8, 'Edicion 1.2', 12, 'Edificio 1.3', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(10, 'Auditorio Caida del server', 1000000, 'Puerto 300', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(11, 'YA no se cae', 10000, 'El servidor ', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(12, 'A ver si esta ves no se cae el servidor', 1000, 'AAAAAAA', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(13, 'Auditorio Test', 1000, 'Para ver si ya no se cae el servidor', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(14, 'Test 2', 2, '100', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(15, 'Ahora el registro si se efectua', 1050, 'MilOchenta', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(16, 'Auditorio Real Center', 1500, 'Av Santa Margarita #1500', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-09 20:10:17'),
(17, 'Registro en SQLITE', 100, 'Prueba de registro en SQLite', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(18, 'Auditorio Central', 1580, 'Av. del Sol #1889, Colonia Atemajac', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(20, 'Auditorioo Central', 1580, 'Av. del Sol #1889, Colonia Atemajac', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(21, 'Auditorio Centro', 1580, 'Av. del Sol #1889, Colonia Atemajac', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(22, 'Auditorio Centro Magno', 1580, 'Av. del Sol #1889, Colonia Atemajac', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27'),
(24, 'Auditorio Centro Magnoo', 1580, 'Av. del Sol #1889, Colonia Atemajac', NULL, 'Activo', '2025-10-02 21:00:27', '2025-10-02 21:00:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido_pat` varchar(50) NOT NULL,
  `apellido_mat` varchar(50) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `telefono` char(10) DEFAULT NULL,
  `imagen_cliente` varchar(512) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido_pat`, `apellido_mat`, `correo`, `telefono`, `imagen_cliente`, `fecha_registro`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Maria Fernanda', 'Álvarez', 'Aranda', 'marifer205@gmail.com', '3312345678', NULL, '2025-10-09 20:11:22', 'Activo', '2025-10-04 05:14:39', '2025-10-09 20:11:22'),
(2, 'Maria Fernanda', 'Álvarez', 'Aranda', 'marifer205@gmail.com', '3312345678', NULL, '2025-10-04 05:15:43', 'Inactivo', '2025-10-04 05:15:37', '2025-10-04 05:15:43'),
(3, 'Maria Fernanda', 'Álvarez', 'Aranda', 'marifer205@gmail.com', '3312345678', NULL, '2025-10-04 05:19:01', 'Activo', '2025-10-04 05:19:01', '2025-10-04 05:19:01'),
(4, 'Maria Fernanda', 'Álvarez', 'Aranda', 'marifer205@gmail.com', '3312345678', NULL, '2025-10-06 02:59:27', 'Activo', '2025-10-06 02:59:27', '2025-10-06 02:59:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entradas`
--

CREATE TABLE `entradas` (
  `id_entrada` int(11) NOT NULL,
  `asiento_id` int(11) NOT NULL,
  `pago_id` int(11) NOT NULL,
  `funcion_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `precio_final` decimal(10,2) DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entradas`
--

INSERT INTO `entradas` (`id_entrada`, `asiento_id`, `pago_id`, `funcion_id`, `cliente_id`, `precio_final`, `estado`, `created_at`, `updated_at`) VALUES
(3, 3, 1, 1, 4, 1500.00, 'Inactivo', '2025-10-06 04:21:37', '2025-10-09 19:59:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id_evento` int(11) NOT NULL,
  `nombre_evento` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `imagen_evento` varchar(512) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `hora_fin` datetime NOT NULL,
  `aforo` int(11) DEFAULT NULL,
  `auditorio_id` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id_evento`, `nombre_evento`, `descripcion`, `imagen_evento`, `fecha`, `hora_fin`, `aforo`, `auditorio_id`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Tinoco Fest', 'Lalalalalal', '', '2025-10-05 08:00:00', '2025-10-05 11:59:59', 8500, 4, 'Activo', '2025-10-06 03:33:02', '2025-10-06 03:37:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_artistas`
--

CREATE TABLE `eventos_artistas` (
  `evento_id` int(11) NOT NULL,
  `artista_id` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Suspendido','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos_artistas`
--

INSERT INTO `eventos_artistas` (`evento_id`, `artista_id`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, 'Activo', '2025-10-06 03:40:24', '2025-10-06 03:43:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `funciones`
--

CREATE TABLE `funciones` (
  `id_funcion` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `fecha_hora_funcion` datetime NOT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Suspendido','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `funciones`
--

INSERT INTO `funciones` (`id_funcion`, `evento_id`, `fecha_hora_funcion`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-10-05 20:00:00', 'Activo', '2025-10-06 03:53:53', '2025-10-06 04:22:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Suspendido','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `cliente_id`, `metodo_pago`, `monto`, `fecha_pago`, `estado`, `created_at`, `updated_at`) VALUES
(1, 4, 'tarjeta', 1500.00, '2025-10-05 10:25:38', 'Activo', '2025-10-06 04:08:05', '2025-10-06 04:08:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id_seccion` int(11) NOT NULL,
  `nombre_seccion` varchar(50) NOT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `auditorio_id` int(11) NOT NULL,
  `imagen_seccion` varchar(512) DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id_seccion`, `nombre_seccion`, `precio_base`, `auditorio_id`, `imagen_seccion`, `estado`, `created_at`, `updated_at`) VALUES
(2, 'General Oriente', 600.00, 3, NULL, 'Activo', '2025-10-03 18:22:01', '2025-10-03 18:22:01'),
(3, 'General Poniente', 666.99, 3, NULL, 'Activo', '2025-10-04 04:28:34', '2025-10-06 04:19:06'),
(4, 'VIP', 1500.00, 3, NULL, 'Activo', '2025-10-04 04:28:49', '2025-10-04 04:33:36'),
(5, 'Coca-Cola', 200.00, 3, NULL, 'Activo', '2025-10-04 04:31:09', '2025-10-04 04:31:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `imagen_usuario` varchar(512) DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Pendiente','Suspendido','Archivado') DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `contraseña`, `rol`, `imagen_usuario`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Bartolome666', '12345678', 'De canela', NULL, 'Activo', '2025-10-06 04:31:00', '2025-10-06 04:32:39');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `artistas`
--
ALTER TABLE `artistas`
  ADD PRIMARY KEY (`id_artista`),
  ADD UNIQUE KEY `nombre_artista` (`nombre_artista`);

--
-- Indices de la tabla `asientos`
--
ALTER TABLE `asientos`
  ADD PRIMARY KEY (`id_asiento`),
  ADD UNIQUE KEY `uq_seccion_fila_numero` (`seccion_id`,`fila`,`numero_asiento`);

--
-- Indices de la tabla `auditorios`
--
ALTER TABLE `auditorios`
  ADD PRIMARY KEY (`id_auditorio`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `entradas`
--
ALTER TABLE `entradas`
  ADD PRIMARY KEY (`id_entrada`),
  ADD UNIQUE KEY `uq_asientos_funcion` (`asiento_id`,`funcion_id`),
  ADD KEY `fk_entradas_pago` (`pago_id`),
  ADD KEY `fk_entradas_funcion` (`funcion_id`),
  ADD KEY `fk_entradas_cliente` (`cliente_id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `fk_eventos_auditorio` (`auditorio_id`);

--
-- Indices de la tabla `eventos_artistas`
--
ALTER TABLE `eventos_artistas`
  ADD PRIMARY KEY (`evento_id`,`artista_id`),
  ADD KEY `fk_evento_artistas_artista` (`artista_id`);

--
-- Indices de la tabla `funciones`
--
ALTER TABLE `funciones`
  ADD PRIMARY KEY (`id_funcion`),
  ADD KEY `fk_funciones_evento` (`evento_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pagos_cliente` (`cliente_id`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id_seccion`),
  ADD UNIQUE KEY `uq_auditorio_seccion` (`auditorio_id`,`nombre_seccion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `artistas`
--
ALTER TABLE `artistas`
  MODIFY `id_artista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `asientos`
--
ALTER TABLE `asientos`
  MODIFY `id_asiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `auditorios`
--
ALTER TABLE `auditorios`
  MODIFY `id_auditorio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `funciones`
--
ALTER TABLE `funciones`
  MODIFY `id_funcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asientos`
--
ALTER TABLE `asientos`
  ADD CONSTRAINT `fk_asientos_seccion` FOREIGN KEY (`seccion_id`) REFERENCES `secciones` (`id_seccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `entradas`
--
ALTER TABLE `entradas`
  ADD CONSTRAINT `fk_entradas_asiento` FOREIGN KEY (`asiento_id`) REFERENCES `asientos` (`id_asiento`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_entradas_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_entradas_funcion` FOREIGN KEY (`funcion_id`) REFERENCES `funciones` (`id_funcion`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_entradas_pago` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id_pago`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `fk_eventos_auditorio` FOREIGN KEY (`auditorio_id`) REFERENCES `auditorios` (`id_auditorio`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `eventos_artistas`
--
ALTER TABLE `eventos_artistas`
  ADD CONSTRAINT `fk_evento_artistas_artista` FOREIGN KEY (`artista_id`) REFERENCES `artistas` (`id_artista`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evento_artistas_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id_evento`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `funciones`
--
ALTER TABLE `funciones`
  ADD CONSTRAINT `fk_funciones_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id_evento`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `fk_secciones_auditorio` FOREIGN KEY (`auditorio_id`) REFERENCES `auditorios` (`id_auditorio`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
