SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE baronesa_bd;
USE baronesa_bd;

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categorias`
--

INSERT INTO `categorias` (`id`, `nome`) VALUES
(1, 'Mesas'),
(2, 'Cadeiras'),
(3, 'Cômodas'),
(4, 'Armários');

-- --------------------------------------------------------

--
-- Estrutura para tabela `moveis`
--

CREATE TABLE `moveis` (
  `id` int(11) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `valor` int(6) NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `foto` varchar(50) DEFAULT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `moveis`
--

INSERT INTO `moveis` (`id`, `nome`, `valor`, `descricao`, `foto`, `categoria_id`) VALUES
(2, 'Cadeira Simples', 200, 'Uma cadeira simples de madeira de carvalho, ideal para mesas simples e ambientes amenos.', NULL, 2),
(3, 'Mesa Simples', 700, 'Mesa simples de madeira, ideal para ambientes simples e confortáveis.', NULL, 1),
(4, 'Cômoda Simples', 1400, 'Uma cômoda feita de madeira de carvalho tratada, envernizada, e com pés em Jatobá. ', NULL, 3),
(5, 'Armário Azul', 3500, 'Um armário bem construído, feito em cor azul, com madeira tratada e envernizada.', NULL, 4);

-- --------------------------------------------------------

--
-- Estrutura para tabela `moveis_fotos`
--

CREATE TABLE `moveis_fotos` (
  `id` int(11) NOT NULL,
  `id_movel` int(11) NOT NULL,
  `foto` varchar(100) NOT NULL,
  `principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `moveis_fotos`
--

INSERT INTO `moveis_fotos` (`id`, `id_movel`, `foto`, `principal`) VALUES
(1, 2, '68fa1a304e8cd_cadeira2.jpg', 1),
(2, 2, '68fa1a30500c2_cadeira.jpg', 0),
(3, 3, '68fa1b107323c_mesas2.jpg', 1),
(4, 3, '68fa1b1073a47_mesas.jpg', 0),
(5, 4, '68fa1bc601d3f_comoda2.jpg', 1),
(6, 4, '68fa1bc6023ec_comoda.jpg', 0),
(7, 5, '68fa1c19c0ff0_armario.jpg', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamentos`
--

CREATE TABLE `orcamentos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `mensagem` varchar(200) NOT NULL,
  `aprovacao` enum('aprovado','desaprovado','naoLido') NOT NULL DEFAULT 'naoLido'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `orcamentos`
--

INSERT INTO `orcamentos` (`id`, `id_usuario`, `id_categoria`, `telefone`, `mensagem`, `aprovacao`) VALUES
(1, 1, 4, '', 'quero um armario 9081 portas feito de mármore suiço tratado com urina de unicórnios castrados.', 'naoLido');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_movel` int(11) NOT NULL,
  `data_pedido` datetime DEFAULT current_timestamp(),
  `status` enum('pendente','aprovado','pago','cancelado') DEFAULT 'pendente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedidos`
--

INSERT INTO `pedidos` (`id`, `id_usuario`, `id_movel`, `data_pedido`, `status`) VALUES
(1, 3, 3, '2025-10-23 14:16:07', 'pendente');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(65) NOT NULL,
  `cargo` enum('admin','usuario') NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `cargo`) VALUES
(1, 'admin', 'admin@admin.com', '$2y$10$Luy8bujm8OuVkqImHFKNiOqmS5dmZSlFQ4LqPVqUPvvQvOgPw8rg.', 'admin'),
(3, 'usuario', 'usuario@usuario.com', '$2y$10$zYwTJaPbF27ApYV4qLTwUON28owCEw3b.XK5aNoPpyILbc9wsx1DG', 'usuario');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `moveis`
--
ALTER TABLE `moveis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Índices de tabela `moveis_fotos`
--
ALTER TABLE `moveis_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_movel` (`id_movel`);

--
-- Índices de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_movel` (`id_movel`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `moveis`
--
ALTER TABLE `moveis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `moveis_fotos`
--
ALTER TABLE `moveis_fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `moveis`
--
ALTER TABLE `moveis`
  ADD CONSTRAINT `moveis_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `moveis_fotos`
--
ALTER TABLE `moveis_fotos`
  ADD CONSTRAINT `moveis_fotos_ibfk_1` FOREIGN KEY (`id_movel`) REFERENCES `moveis` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `orcamentos`
--
ALTER TABLE `orcamentos`
  ADD CONSTRAINT `orcamentos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orcamentos_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_movel`) REFERENCES `moveis` (`id`) ON DELETE CASCADE;
COMMIT;

