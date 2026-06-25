-- Arquivo SQL para criar as tabelas e relacionamentos do banco de dados

USE projeto;

CREATE TABLE Usuario 
    (Matricula       INT PRIMARY KEY,  
     Data_nascimento DATE,  
     Email           VARCHAR(256) NOT NULL,  
     Nome            VARCHAR(100) NOT NULL,
     Senha           VARCHAR(255) NOT NULL,  
     Foto            LONGBLOB,  
     UNIQUE (Email)); 

CREATE TABLE Servidor 
    (Matricula      INT PRIMARY KEY,  
     Data_contrato  DATE NOT NULL,  
     idFuncao       INT NOT NULL); 

CREATE TABLE Estudante 
    (Matricula INT PRIMARY KEY,  
     Semestre  FLOAT NOT NULL,  
     idCurso   CHAR(3) NOT NULL); 

CREATE TABLE Servico 
    (Descricao_serv VARCHAR(256) NOT NULL,  
     Nome_serv      VARCHAR(100) NOT NULL,  
     Codigo_serv    INT PRIMARY KEY,  
     UNIQUE (Nome_serv)); 

CREATE TABLE Departamento 
    (Sigla_dep    CHAR(3) PRIMARY KEY,  
     Nome_dep     VARCHAR(100) NOT NULL,  
     Local_fisico VARCHAR(256),  
     UNIQUE (Nome_dep)); 

CREATE TABLE Agendamento 
    (Id             INT PRIMARY KEY,  
     Data_hora      DATE NOT NULL,  
     Lugar          VARCHAR(100) NOT NULL,  
     idSolicitacao  INT UNSIGNED NOT NULL); 

CREATE TABLE Curso 
    (Sigla_curso CHAR(3) PRIMARY KEY,  
     Nome_curso  VARCHAR(100) NOT NULL); 

CREATE TABLE Funcao 
    (Codigo_fn  INT PRIMARY KEY,  
     Nome_fn    VARCHAR(100) NOT NULL); 

CREATE TABLE Solicitacao 
    (Senha        INT UNSIGNED AUTO_INCREMENT,  
     idEstudante  INT,  
     Codigo_serv  INT,  
     Data_emissao DATE NOT NULL,
     PRIMARY KEY (Senha, idEstudante, Codigo_serv)); 

CREATE TABLE Oferece 
    (Sigla_dep   CHAR(3),  
     Codigo_serv INT,
     PRIMARY KEY (Sigla_dep, Codigo_serv)); 

CREATE TABLE Avaliacao 
    (Data_hora      DATETIME,  
     idAgentamento  INT,  
     idServidor     INT,  
     Resultado      BOOLEAN NOT NULL,
     PRIMARY KEY (idAgentamento, idServidor, Data_hora)); 

ALTER TABLE Servidor ADD FOREIGN KEY(Matricula) REFERENCES Usuario (Matricula) ON DELETE CASCADE;
ALTER TABLE Servidor ADD FOREIGN KEY(idFuncao) REFERENCES Funcao (Codigo_fn) ON DELETE CASCADE;
ALTER TABLE Estudante ADD FOREIGN KEY(Matricula) REFERENCES Usuario (Matricula) ON DELETE CASCADE;
ALTER TABLE Estudante ADD FOREIGN KEY(idCurso) REFERENCES Curso (Sigla_curso) ON DELETE CASCADE;
ALTER TABLE Agendamento ADD FOREIGN KEY(idSolicitacao) REFERENCES Solicitacao (Senha) ON DELETE CASCADE;
ALTER TABLE Solicitacao ADD FOREIGN KEY(idEstudante) REFERENCES Estudante (Matricula) ON DELETE CASCADE;
ALTER TABLE Solicitacao ADD FOREIGN KEY(Codigo_serv) REFERENCES Servico (Codigo_serv) ON DELETE CASCADE;
ALTER TABLE Oferece ADD FOREIGN KEY(Sigla_dep) REFERENCES Departamento (Sigla_dep) ON DELETE CASCADE;
ALTER TABLE Oferece ADD FOREIGN KEY(Codigo_serv) REFERENCES Servico (Codigo_serv) ON DELETE CASCADE;
ALTER TABLE Avaliacao ADD FOREIGN KEY(idAgentamento) REFERENCES Agendamento (Id) ON DELETE CASCADE;
ALTER TABLE Avaliacao ADD FOREIGN KEY(idServidor) REFERENCES Servidor (Matricula) ON DELETE CASCADE;

CREATE TRIGGER unique_matricula BEFORE INSERT ON Usuario
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Usuario WHERE Usuario.Matricula = NEW.Matricula) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Matricula já existe na tabela Usuario.';
    END IF;
END;