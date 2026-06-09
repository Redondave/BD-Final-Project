-- Arquivo SQL para criar as tabelas e relacionamentos do banco de dados

USE {{DB_NAME}};

CREATE TABLE Usuario 
    (Matricula      INT PRIMARY KEY,  
     Data_nascimento DATE,  
     Email           VARCHAR(256) NOT NULL,  
     Nome            VARCHAR(100) NOT NULL,  
     Foto            JSON,  
     UNIQUE (Email)); 

CREATE TABLE Servidor 
    (Matricula      INT PRIMARY KEY,  
     Data_contrato  DATE NOT NULL,  
     idFuncao       INT NOT NULL); 

CREATE TABLE Estudante 
    (Matricula INT PRIMARY KEY,  
     Semestre  FLOAT NOT NULL,  
     idCurso   INT NOT NULL); 

CREATE TABLE Servico 
    (Descricao_serv VARCHAR NOT NULL,  
     Nome_serv      VARCHAR NOT NULL,  
     Codigo_serv    INT PRIMARY KEY,  
     UNIQUE (Nome)); 

CREATE TABLE Departamento 
    (Sigla_dep    CHAR(3) PRIMARY KEY,  
     Nome_dep     VARCHAR NOT NULL,  
     Local_fisico VARCHAR,  
     UNIQUE (Nome)); 

CREATE TABLE Agendamento 
    (Id             INT PRIMARY KEY,  
     Data_hora      DATE NOT NULL,  
     Lugar          VARCHAR NOT NULL,  
     idSolicitacao  INT NOT NULL); 

CREATE TABLE Curso 
    (Sigla_curso CHAR(3) PRIMARY KEY,  
     Nome_curso  VARCHAR NOT NULL); 

CREATE TABLE Funcao 
    (Codigo_fn  INT PRIMARY KEY,  
     Nome_fn    VARCHAR NOT NULL); 

CREATE TABLE Solicitacao 
    (Senha        INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
     idEstudante  INT PRIMARY KEY,  
     Codigo_serv  INT PRIMARY KEY,  
     Data_emissao DATE NOT NULL); 

CREATE TABLE Oferece 
    (Sigla_dep   CHAR(3) PRIMARY KEY,  
     Codigo_serv INT PRIMARY KEY); 

CREATE TABLE Avaliacao 
    (Data_hora      DATETIME PRIMARY KEY,  
     idAgentamento  INT PRIMARY KEY,  
     idServidor     INT PRIMARY KEY,  
     Resultado      BOOLEAN NOT NULL); 

ALTER TABLE Servidor ADD FOREIGN KEY(Matricula) REFERENCES Usuario (Matricula)
ALTER TABLE Servidor ADD FOREIGN KEY(idFuncao) REFERENCES Funcao (idFuncao)
ALTER TABLE Estudante ADD FOREIGN KEY(Matricula) REFERENCES Usuario (Matricula)
ALTER TABLE Estudante ADD FOREIGN KEY(idCurso) REFERENCES Curso (idCurso)
ALTER TABLE Agendamento ADD FOREIGN KEY(idSolicitacao) REFERENCES Solicitacao (idSolicitacao)
ALTER TABLE Solicitacao ADD FOREIGN KEY(idEstudante) REFERENCES Estudante (idEstudante)
ALTER TABLE Solicitacao ADD FOREIGN KEY(Codigo_serv) REFERENCES Servico (Codigo_serv)
ALTER TABLE Oferece ADD FOREIGN KEY(Sigla_dep) REFERENCES Departamento (Sigla_dep)
ALTER TABLE Oferece ADD FOREIGN KEY(Codigo_serv) REFERENCES Servico (Codigo_serv)
ALTER TABLE Avaliacao ADD FOREIGN KEY(idAgentamento) REFERENCES Agendamento (idAgentamento)
ALTER TABLE Avaliacao ADD FOREIGN KEY(idServidor) REFERENCES Servidor (idServidor)
