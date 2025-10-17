SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `baronesa_bd`;
USE `baronesa_bd`;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id`        INT(11) NOT NULL AUTO_INCREMENT,
  `nome`      VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela de móveis
CREATE TABLE IF NOT EXISTS `moveis` (
  `id`        INT(11) NOT NULL AUTO_INCREMENT,
  `nome`      VARCHAR(60) NOT NULL,
  `valor`     INT(6) NOT NULL,
  `descricao` VARCHAR(200) DEFAULT NULL,
  `foto`      VARCHAR(50) DEFAULT NULL,
  `categoria_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela de fotos extras dos móveis
CREATE TABLE IF NOT EXISTS `moveis_fotos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_movel`    INT(11) NOT NULL,
  `foto`        VARCHAR(100) NOT NULL,
  `principal`   TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_movel`) REFERENCES `moveis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id`      INT(11) NOT NULL AUTO_INCREMENT,
  `nome`    VARCHAR(15) NOT NULL,
  `email`   VARCHAR(50) NOT NULL,
  `senha`   VARCHAR(65) NOT NULL,
  `cargo`   ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `orcamentos` (
  `id`            INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario`    INT(11) NOT NULL,
  `id_categoria`  INT(11) NOT NULL, 
  `telefone`      VARCHAR(20) NOT NULL,
  `mensagem`      VARCHAR(200) NOT NULL,
  `aprovacao` ENUM('aprovado', 'desaprovado', 'naoLido') NOT NULL DEFAULT 'naoLido',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_movel INT NOT NULL,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'aprovado', 'pago', 'cancelado') DEFAULT 'pendente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_movel) REFERENCES moveis(id) ON DELETE CASCADE
);



-- Inserir categorias
INSERT INTO `categorias` (`nome`) VALUES 
  ('Mesas'),
  ('Cadeiras'),
  ('Cômodas'),
  ('Armários');


-- Inserir móveis (ajustando categoria_id)
INSERT INTO `moveis` (`nome`, `valor`, `descricao`, `categoria_id`, `foto`) VALUES
('Armário Uma porta', 200, 'Armário simples de cor marrom, ideal para cozinhas', 4, 'armariosimples.jpg');

-- Inserir usuários
-- senha admin: 123
INSERT INTO `usuarios` (`nome`, `email`, `senha`, `cargo`) VALUES
('admin', 'cavalogames1231@gmail.com', '$2y$10$Luy8bujm8OuVkqImHFKNiOqmS5dmZSlFQ4LqPVqUPvvQvOgPw8rg.', 'admin'),
('adminTeste', 'teste@gmail.com', '$2y$10$J4uGkjV1QdlITa8fGJYcu.KyA9OjBq6TzE3cA6F2i3vDCYqH7rrIe', 'usuario');

INSERT INTO `orcamentos` (`id_usuario`, `id_categoria`, `mensagem`) VALUES ('1', '4', 'quero um armario 9081 portas feito de mármore suiço tratado com urina de unicórnios castrados.');

COMMIT;