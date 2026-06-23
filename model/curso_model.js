const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de curso com as operações CRUD
const Curso = {
    findAll: async function() {
        const [rows] = await pool.query('SELECT * FROM Curso ORDER BY Sigla_curso');
        return rows;
    },

    findBySigla: async function(sigla) {
        const [rows] = await pool.query('SELECT * FROM Curso WHERE Sigla_curso = ?', [sigla]);
        return rows[0] || null;
    },

    create: async function(curso) {
        const { Sigla_curso, Nome_curso } = curso;
        const [result] = await pool.query('INSERT INTO Curso (Sigla_curso, Nome_curso) VALUES (?, ?)', [
            Sigla_curso,
            Nome_curso
        ]);
        return result.affectedRows > 0;
    },

    update: async function(sigla, curso) {
        const { Nome_curso } = curso;
        const [result] = await pool.query('UPDATE Curso SET Nome_curso = ? WHERE Sigla_curso = ?', [
            Nome_curso,
            sigla
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(sigla) {
        const [result] = await pool.query('DELETE FROM Curso WHERE Sigla_curso = ?', [sigla]);
        return result.affectedRows > 0;
    }
};

module.exports = Curso;
