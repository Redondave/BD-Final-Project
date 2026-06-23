const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de serviço com as operações CRUD
const Servico = {
    findAll: async function() {
        const [rows] = await pool.query('SELECT * FROM Servico ORDER BY Codigo_serv');
        return rows;
    },

    findByCodigo: async function(codigo) {
        const [rows] = await pool.query('SELECT * FROM Servico WHERE Codigo_serv = ?', [codigo]);
        return rows[0] || null;
    },

    create: async function(servico) {
        const { Codigo_serv, Nome_serv, Descricao_serv } = servico;
        const [result] = await pool.query('INSERT INTO Servico (Codigo_serv, Nome_serv, Descricao_serv) VALUES (?, ?, ?)', [
            Codigo_serv,
            Nome_serv,
            Descricao_serv
        ]);
        return result.affectedRows > 0;
    },

    update: async function(codigo, servico) {
        const { Nome_serv, Descricao_serv } = servico;
        const [result] = await pool.query('UPDATE Servico SET Nome_serv = ?, Descricao_serv = ? WHERE Codigo_serv = ?', [
            Nome_serv,
            Descricao_serv,
            codigo
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(codigo) {
        const [result] = await pool.query('DELETE FROM Servico WHERE Codigo_serv = ?', [codigo]);
        return result.affectedRows > 0;
    }
};

module.exports = Servico;
