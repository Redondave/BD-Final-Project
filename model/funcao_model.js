const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de função com as operações CRUD
const Funcao = {
    findAll: async function() {
        const [rows] = await pool.query('SELECT * FROM Funcao ORDER BY Codigo_fn');
        return rows;
    },

    findByCodigo: async function(codigo) {
        const [rows] = await pool.query('SELECT * FROM Funcao WHERE Codigo_fn = ?', [codigo]);
        return rows[0] || null;
    },

    create: async function(funcao) {
        const { Codigo_fn, Nome_fn } = funcao;
        const [result] = await pool.query('INSERT INTO Funcao (Codigo_fn, Nome_fn) VALUES (?, ?)', [
            Codigo_fn,
            Nome_fn
        ]);
        return result.affectedRows > 0;
    },

    update: async function(codigo, funcao) {
        const { Nome_fn, Codigo_fn } = funcao;
        const [result] = await pool.query('UPDATE Funcao SET Nome_fn = ?, Codigo_fn = ? WHERE Codigo_fn = ?', [
            Nome_fn,
            Codigo_fn,
            codigo
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(codigo) {
        const [result] = await pool.query('DELETE FROM Funcao WHERE Codigo_fn = ?', [codigo]);
        return result.affectedRows > 0;
    }
};

module.exports = Funcao;
