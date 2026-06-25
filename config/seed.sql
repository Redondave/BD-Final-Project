USE projeto;

-- ===================== Usuario =====================
INSERT INTO Usuario (Matricula, Data_nascimento, Email, Nome, Senha, Foto) VALUES
(19107647, '2000-01-10', 'user1@email.com', 'Joao Silva', 'senha1', NULL),
(202780233, '1999-05-20', 'user2@email.com', 'Maria Souza', 'senha2', NULL),
(20255465, '2001-07-15', 'user3@email.com', 'Pedro Lima', 'senha3', NULL),
(22100875, '1998-03-30', 'user4@email.com', 'Ana Costa', 'senha4', NULL),
(241020741, '2002-11-25', 'user5@email.com', 'Lucas Rocha', 'senha5', NULL),
(6643543, '1950-01-01', 'servidor1@email.com', 'Maristela', 'senha_servidor1', NULL),
(6245322, '1967-06-10', 'servidor2@email.com', 'Ladeira', 'senha_servidor2', NULL),
(6778982, '1976-01-15', 'servidor3@email.com', 'Zé', 'senha_servidor3', NULL),
(6212122, '1990-09-20', 'servidor4@email.com', 'Mandelli', 'senha_servidor4', NULL),
(5567435, '1986-03-05', 'servidor5@email.com', 'Koike', 'senha_servidor5', NULL);

-- ===================== Curso =====================
INSERT INTO Curso (Sigla_curso, Nome_curso) VALUES
('ENG', 'Engenharia'),
('MED', 'Medicina'),
('DIR', 'Direito'),
('ADM', 'Administracao'),
('INF', 'Informatica');

-- ===================== Funcao =====================
INSERT INTO Funcao (Codigo_fn, Nome_fn) VALUES
(1, 'Professor'),
(2, 'Secretario'),
(3, 'Coordenador'),
(4, 'Atendente'),
(5, 'Tecnico');

-- ===================== Servidor =====================
INSERT INTO Servidor (Matricula, Data_contrato, idFuncao) VALUES
(6643543, '2020-02-01', 1),
(6245322, '2019-06-10', 1),
(6778982, '2021-01-15', 3),
(6212122, '2018-09-20', 1),
(5567435, '2022-03-05', 5);

-- ===================== Estudante =====================
INSERT INTO Estudante (Matricula, Semestre, idCurso) VALUES
(19107647, 2019.1, 'ENG'),
(202780233, 2020.2, 'MED'),
(20255465, 2020.2, 'DIR'),
(22100875, 2022.1, 'ADM'),
(241020741, 2024.1, 'INF');

-- ===================== Servico =====================
INSERT INTO Servico (Descricao_serv, Nome_serv, Codigo_serv) VALUES
('Emissao de documento', 'Documento', 101),
('Atendimento academico', 'Atendimento', 102),
('Suporte tecnico', 'Suporte', 103),
('Redefinicao de Matricula', 'Matricula', 104),
('Consultoria Financeira', 'Financeiro', 105);

-- ===================== Departamento =====================
INSERT INTO Departamento (Sigla_dep, Nome_dep, Local_fisico) VALUES
('ADM', 'Administracao Geral', 'Faculdade de Administração, Economia e Contabilidade'),
('INF', 'Informatica', 'Instituro de Ciência da Computação e Estatística'),
('DIR', 'Direito', 'Faculdade de Direito'),
('MED', 'Medicina', 'Faculdade de Saúde'),
('ENG', 'Engenharia', 'Faculdade de Tecnologia');

-- ===================== Solicitacao =====================
INSERT INTO Solicitacao (Senha, idEstudante, Codigo_serv, Data_emissao) VALUES
(1, 202780233, 101, '2024-01-10'),
(2, 202780233, 102, '2024-01-11'),
(3, 241020741, 103, '2024-01-12'),
(4, 22100875, 104, '2024-01-13'),
(5, 19107647, 105, '2024-01-14');

-- ===================== Agendamento =====================
INSERT INTO Agendamento (Id, Data_hora, Lugar, idSolicitacao) VALUES
(1, '2024-02-01', 'Sala 1', 1),
(2, '2024-02-02', 'Sala 2', 2),
(3, '2024-02-03', 'Sala 3', 3),
(4, '2024-02-04', 'Sala 4', 4),
(5, '2024-02-05', 'Sala 5', 5);

-- ===================== Oferece =====================
INSERT INTO Oferece (Sigla_dep, Codigo_serv) VALUES
('ADM', 101),
('INF', 102),
('DIR', 103),
('MED', 104),
('ENG', 105);

-- ===================== Avaliacao =====================
INSERT INTO Avaliacao (Data_hora, idAgentamento, idServidor, Resultado) VALUES
('2024-02-01 10:00:00', 1, 6643543, TRUE),
('2024-02-02 11:00:00', 2, 6643543, TRUE),
('2024-02-03 12:00:00', 3, 6643543, FALSE),
('2024-02-04 13:00:00', 4, 5567435, TRUE),
('2024-02-05 14:00:00', 5, 5567435, FALSE);
