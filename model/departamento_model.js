const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de departamento com as operações CRUD
const Departamento = {
    findAll: async function() {
        const [rows] = await pool.query('SELECT * FROM Departamento ORDER BY Sigla_dep');
        return rows;
    },

    findBySigla: async function(sigla) {
        const [rows] = await pool.query('SELECT * FROM Departamento WHERE Sigla_dep = ?', [sigla]);
        return rows[0] || null;
    },

    create: async function(departamento) {
        const { Sigla_dep, Nome_dep, Local_fisico } = departamento;
        const [result] = await pool.query('INSERT INTO Departamento (Sigla_dep, Nome_dep, Local_fisico) VALUES (?, ?, ?)', [
            Sigla_dep,
            Nome_dep,
            Local_fisico || null
        ]);
        return result.affectedRows > 0;
    },

    update: async function(sigla, departamento) {
        const { Nome_dep, Local_fisico } = departamento;
        const [result] = await pool.query('UPDATE Departamento SET Nome_dep = ?, Local_fisico = ? WHERE Sigla_dep = ?', [
            Nome_dep,
            Local_fisico || null,
            sigla
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(sigla) {
        const [result] = await pool.query('DELETE FROM Departamento WHERE Sigla_dep = ?', [sigla]);
        return result.affectedRows > 0;
    }
};

module.exports = Departamento;
