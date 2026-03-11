-- ================================================
-- Banco de dados: dareverso
-- ================================================

CREATE DATABASE IF NOT EXISTS dareverso_local
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dareverso_local;

-- ------------------------------------------------
-- Categorias / Gêneros das histórias
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Avisos de conteúdo
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS avisos (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO avisos (nome, slug) VALUES
  ('Álcool', 'alcool'),
  ('Violência', 'violencia'),
  ('Linguagem forte', 'linguagem-forte'),
  ('Conteúdo adulto', 'conteudo-adulto'),
  ('Drogas', 'drogas'),
  ('Automutilação', 'automutilacao'),
  ('Morte', 'morte');

-- ------------------------------------------------
-- Histórias
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS historias (
  id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo               VARCHAR(255) NOT NULL,
  slug                 VARCHAR(255) NOT NULL UNIQUE,
  sinopse              TEXT         DEFAULT NULL,
  capa_url             VARCHAR(500) DEFAULT NULL,
  classificacao_etaria VARCHAR(10)  DEFAULT 'Livre',
  publicada            TINYINT(1)   DEFAULT 0,
  data_publicacao      DATETIME     DEFAULT NULL,
  created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Relação histórias <-> categorias (muitos para muitos)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS historia_categorias (
  historia_id  INT UNSIGNED NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (historia_id, categoria_id),
  FOREIGN KEY (historia_id)  REFERENCES historias(id)  ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Relação histórias <-> avisos (muitos para muitos)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS historia_avisos (
  historia_id INT UNSIGNED NOT NULL,
  aviso_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (historia_id, aviso_id),
  FOREIGN KEY (historia_id) REFERENCES historias(id) ON DELETE CASCADE,
  FOREIGN KEY (aviso_id)    REFERENCES avisos(id)    ON DELETE CASCADE
);

-- ------------------------------------------------
-- Usuários
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  senha      VARCHAR(255) NOT NULL,
  is_admin   TINYINT(1)   DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Sessões (tokens de autenticação)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS sessoes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT UNSIGNED NOT NULL,
  token       VARCHAR(64)  NOT NULL UNIQUE,
  expires_at  DATETIME     NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Histórias lidas por cada usuário
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS historias_lidas (
  usuario_id  INT UNSIGNED NOT NULL,
  historia_id INT UNSIGNED NOT NULL,
  lida_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, historia_id),
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE,
  FOREIGN KEY (historia_id) REFERENCES historias(id) ON DELETE CASCADE
);

-- ------------------------------------------------
-- Capítulos das histórias
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS capitulos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  historia_id INT UNSIGNED NOT NULL,
  titulo      VARCHAR(255) NOT NULL,
  conteudo    LONGTEXT     NOT NULL,
  ordem       INT UNSIGNED NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (historia_id) REFERENCES historias(id) ON DELETE CASCADE
);
