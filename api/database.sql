-- ================================================
-- Banco de dados: dareverso
-- ================================================

CREATE DATABASE IF NOT EXISTS dareverso_local
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dareverso_local;

-- ------------------------------------------------
-- Categorias / Gêneros
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Tipos (universo alternativo, canon, crossover...)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Personagens
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS personagens (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(150) NOT NULL,
  slug       VARCHAR(150) NOT NULL UNIQUE,
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
  created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Relações muitos-para-muitos
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS historia_categorias (
  historia_id  INT UNSIGNED NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (historia_id, categoria_id),
  FOREIGN KEY (historia_id)  REFERENCES historias(id)  ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historia_tipos (
  historia_id INT UNSIGNED NOT NULL,
  tipo_id     INT UNSIGNED NOT NULL,
  PRIMARY KEY (historia_id, tipo_id),
  FOREIGN KEY (historia_id) REFERENCES historias(id) ON DELETE CASCADE,
  FOREIGN KEY (tipo_id)     REFERENCES tipos(id)     ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historia_personagens (
  historia_id   INT UNSIGNED NOT NULL,
  personagem_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (historia_id, personagem_id),
  FOREIGN KEY (historia_id)   REFERENCES historias(id)   ON DELETE CASCADE,
  FOREIGN KEY (personagem_id) REFERENCES personagens(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historia_avisos (
  historia_id INT UNSIGNED NOT NULL,
  aviso_id    INT UNSIGNED NOT NULL,
  PRIMARY KEY (historia_id, aviso_id),
  FOREIGN KEY (historia_id) REFERENCES historias(id) ON DELETE CASCADE,
  FOREIGN KEY (aviso_id)    REFERENCES avisos(id)    ON DELETE CASCADE
);

-- ------------------------------------------------
-- Capítulos
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

-- ------------------------------------------------
-- Destaques (carousel da home)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS destaques (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(255) NOT NULL,
  descricao   TEXT         DEFAULT NULL,
  imagem_url  VARCHAR(500) DEFAULT NULL,
  historia_id INT UNSIGNED DEFAULT NULL,
  ordem       INT UNSIGNED NOT NULL DEFAULT 1,
  ativo       TINYINT(1)   DEFAULT 1,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (historia_id) REFERENCES historias(id) ON DELETE SET NULL
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
