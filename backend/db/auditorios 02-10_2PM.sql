-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-10-2025 a las 22:01:31
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
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asientos`
--

CREATE TABLE `asientos` (
  `id_asiento` int(11) NOT NULL,
  `seccion_id` int(11) NOT NULL,
  `fila` int(11) NOT NULL,
  `numero_asiento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditorios`
--

CREATE TABLE `auditorios` (
  `id_auditorio` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `ubicacion` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auditorios`
--

INSERT INTO `auditorios` (`id_auditorio`, `nombre`, `capacidad`, `ubicacion`) VALUES
(3, 'Auditorio Villa Hermosa', 3000, 'Villa Hermosa #440 Av. de la Paz'),
(4, 'Auditorio 4', 100, 'Mi casa'),
(5, 'Auditorio 5', 1000, 'Av. Boulevard #115'),
(6, 'Auditorio Lopez Doriga', 90000, 'Lalala'),
(7, 'Edicion 1', 10, 'Edificio 1.1'),
(8, 'Edicion 1.2', 12, 'Edificio 1.3'),
(10, 'Auditorio Caida del server', 1000000, 'Puerto 300'),
(11, 'YA no se cae', 10000, 'El servidor '),
(12, 'A ver si esta ves no se cae el servidor', 1000, 'AAAAAAA'),
(13, 'Auditorio Test', 1000, 'Para ver si ya no se cae el servidor'),
(14, 'Test 2', 2, '100'),
(15, 'Ahora el registro si se efectua', 1050, 'MilOchenta'),
(16, 'Auditorio Real Center', 1500, 'Av Santa Margarita #1500'),
(17, 'Registro en SQLITE', 100, 'Prueba de registro en SQLite'),
(18, 'Auditorio Central', 1580, 'Av. del Sol #1889, Colonia Atemajac'),
(20, 'Auditorioo Central', 1580, 'Av. del Sol #1889, Colonia Atemajac'),
(21, 'Auditorio Centro', 1580, 'Av. del Sol #1889, Colonia Atemajac'),
(22, 'Auditorio Centro Magno', 1580, 'Av. del Sol #1889, Colonia Atemajac'),
(24, 'Auditorio Centro Magnoo', 1580, 'Av. del Sol #1889, Colonia Atemajac');

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
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `precio_final` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id_evento` int(11) NOT NULL,
  `nombre_evento` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `hora_fin` datetime NOT NULL,
  `aforo` int(11) DEFAULT NULL,
  `auditorio_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento_artistas`
--

CREATE TABLE `evento_artistas` (
  `evento_id` int(11) NOT NULL,
  `artista_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `funciones`
--

CREATE TABLE `funciones` (
  `id_funcion` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `fecha_hora_funcion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id_seccion` int(11) NOT NULL,
  `nombre_seccion` varchar(50) NOT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `auditorio_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indices de la tabla `evento_artistas`
--
ALTER TABLE `evento_artistas`
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
  MODIFY `id_artista` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `asientos`
--
ALTER TABLE `asientos`
  MODIFY `id_asiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auditorios`
--
ALTER TABLE `auditorios`
  MODIFY `id_auditorio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `funciones`
--
ALTER TABLE `funciones`
  MODIFY `id_funcion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id_seccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

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
-- Filtros para la tabla `evento_artistas`
--
ALTER TABLE `evento_artistas`
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
