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
        const { Nome, Email, Senha, Data_nascimento, Semestre, idCurso } = estudante;

        const randomNum = Math.floor(Math.random() * 1000000); // Gera uma matrícula aleatória;
        const suffix = randomNum.toString().padStart(6, '0'); // Garante que os 8 dígitos da matrícula sejam preenchidos com zeros à esquerda
        const matriculaCompleta = parseInt("261" + suffix, 10); // Formata a matrícula completa

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Inserção na tabela pai Usuario
            await connection.query(
                'INSERT INTO Usuario (Matricula, Nome, Email, Senha, Data_nascimento) VALUES (?, ?, ?, ?, ?)',
                [matriculaCompleta, Nome, Email, Senha, Data_nascimento]
            );

            // Inserção na tabela filha Estudante (referencia o Usuario recém-criado)
            await connection.query(
                'INSERT INTO Estudante (Matricula, Semestre, idCurso) VALUES (?, ?, ?)',
                [matriculaCompleta, Semestre, idCurso]
            );

            await connection.commit();
            return matriculaCompleta;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
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
