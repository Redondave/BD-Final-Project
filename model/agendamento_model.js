const db = require('../config/database');
const pool = db.appPool;

const Agendamento = {
    findAll: async function() {
        const [rows] = await pool.query(`
            SELECT a.*, s.Data_emissao, s.Codigo_serv
            FROM Agendamento a
            JOIN Solicitacao s ON a.idSolicitacao = s.Senha
            ORDER BY a.Data_hora DESC
        `);
        return rows;
    },

    findById: async function(id) {
        const [rows] = await pool.query('SELECT * FROM Agendamento WHERE Id = ?', [id]);
        return rows[0] || null;
    },

    create: async function(agendamento) {
        const { Id, Data_hora, Lugar, idSolicitacao } = agendamento;
        
        // Verifica se Solicitacao existe
        const [solicitacao] = await pool.query('SELECT Senha FROM Solicitacao WHERE Senha = ?', [idSolicitacao]);
        if (solicitacao.length === 0) throw new Error('Solicitação não encontrada');

        const [result] = await pool.query('INSERT INTO Agendamento (Id, Data_hora, Lugar, idSolicitacao) VALUES (?, ?, ?, ?)', [
            Id,
            Data_hora,
            Lugar,
            idSolicitacao
        ]);
        return result.affectedRows > 0;
    },

    update: async function(id, agendamento) {
        const { Data_hora, Lugar } = agendamento;
        const [result] = await pool.query('UPDATE Agendamento SET Data_hora = ?, Lugar = ? WHERE Id = ?', [
            Data_hora,
            Lugar,
            id
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(id) {
        const [result] = await pool.query('DELETE FROM Agendamento WHERE Id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Agendamento;
