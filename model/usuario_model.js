const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de usuário com as operações CRUD
const Usuario = {
    findAll: async function() {
    const [rows] = await pool.query('SELECT * FROM Usuario ORDER BY Matricula DESC');
    return rows;
    },

    findByMatricula: async function(Matricula) {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE Matricula = ?', [Matricula]);
    return rows[0] || null;
    },

    create: async function(usuario) {
    const { Nome, Email, Senha } = usuario;
    const [result] = await pool.query('INSERT INTO Usuario (Nome, Email, Senha) VALUES (?, ?, ?)', [
        Nome,
        Email,
        Senha,
    ]);

    return { Matricula: result.insertMatricula, Nome, Email, Senha };
    },

    update: async function(Matricula, usuario) {
    const { Nome, Email, Senha } = usuario;
    const [result] = await pool.query('UPDATE Usuario SET Nome = ?, Email = ?, Senha = ? WHERE Matricula = ?', [
        Nome,
        Email,
        Senha,
        Matricula,
    ]);

    return result.affectedRows > 0;
    },

    remove: async function(Matricula) {
    const [result] = await pool.query('DELETE FROM Usuario WHERE Matricula = ?', [Matricula]);
    return result.affectedRows > 0;
    }
};

module.exports = Usuario;