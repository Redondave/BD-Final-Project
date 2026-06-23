const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de estudante com as operações CRUD
// Acessa múltiplas tabelas: Estudante, Usuario e Curso
const Estudante = {
    // JOIN com Usuario e Curso para retornar dados completos
    findAll: async function() {
        const [rows] = await pool.query(`
            SELECT e.Matricula, e.Semestre, e.idCurso,
                   u.Nome, u.Email, u.Data_nascimento,
                   c.Nome_curso
            FROM Estudante e
            JOIN Usuario u ON e.Matricula = u.Matricula
            JOIN Curso c ON e.idCurso = c.Sigla_curso
            ORDER BY u.Nome
        `);
        return rows;
    },

    findByMatricula: async function(matricula) {
        const [rows] = await pool.query(`
            SELECT e.Matricula, e.Semestre, e.idCurso,
                   u.Nome, u.Email, u.Data_nascimento,
                   c.Nome_curso
            FROM Estudante e
            JOIN Usuario u ON e.Matricula = u.Matricula
            JOIN Curso c ON e.idCurso = c.Sigla_curso
            WHERE e.Matricula = ?
        `, [matricula]);
        return rows[0] || null;
    },

    // Acesso multi-tabela: verifica existência do Usuario e do Curso antes de inserir
    create: async function(estudante) {
        const { Matricula, Semestre, idCurso } = estudante;

        // Verifica se o Usuario existe
        const [usuario] = await pool.query('SELECT Matricula FROM Usuario WHERE Matricula = ?', [Matricula]);
        if (usuario.length === 0) {
            throw new Error('Usuário com esta matrícula não existe. Cadastre o usuário primeiro.');
        }

        // Verifica se o Curso existe
        const [curso] = await pool.query('SELECT Sigla_curso FROM Curso WHERE Sigla_curso = ?', [idCurso]);
        if (curso.length === 0) {
            throw new Error('Curso com esta sigla não existe.');
        }

        // Verifica se já não é estudante
        const [existente] = await pool.query('SELECT Matricula FROM Estudante WHERE Matricula = ?', [Matricula]);
        if (existente.length > 0) {
            throw new Error('Este usuário já está cadastrado como estudante.');
        }

        const [result] = await pool.query('INSERT INTO Estudante (Matricula, Semestre, idCurso) VALUES (?, ?, ?)', [
            Matricula,
            Semestre,
            idCurso
        ]);
        return result.affectedRows > 0;
    },

    update: async function(matricula, estudante) {
        const { Semestre, idCurso } = estudante;

        // Se estiver atualizando o curso, verifica se existe
        if (idCurso) {
            const [curso] = await pool.query('SELECT Sigla_curso FROM Curso WHERE Sigla_curso = ?', [idCurso]);
            if (curso.length === 0) {
                throw new Error('Curso com esta sigla não existe.');
            }
        }

        const [result] = await pool.query('UPDATE Estudante SET Semestre = ?, idCurso = ? WHERE Matricula = ?', [
            Semestre,
            idCurso,
            matricula
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(matricula) {
        const [result] = await pool.query('DELETE FROM Estudante WHERE Matricula = ?', [matricula]);
        return result.affectedRows > 0;
    }
};

module.exports = Estudante;
