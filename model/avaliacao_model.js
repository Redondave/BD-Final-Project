const db = require('../config/database');
const pool = db.appPool;

const Avaliacao = {
    findAll: async function() {
        const [rows] = await pool.query(`
            SELECT av.*, a.Lugar, u.Nome as Nome_Servidor
            FROM Avaliacao av
            JOIN Agendamento a ON av.idAgentamento = a.Id
            JOIN Servidor s ON av.idServidor = s.Matricula
            JOIN Usuario u ON s.Matricula = u.Matricula
            ORDER BY av.Data_hora DESC
        `);
        return rows;
    },

    findByIds: async function(idAgentamento, idServidor) {
        const [rows] = await pool.query('SELECT * FROM Avaliacao WHERE idAgentamento = ? AND idServidor = ?', [idAgentamento, idServidor]);
        return rows;
    },

    create: async function(avaliacao) {
        const { Data_hora, idAgentamento, idServidor, Resultado } = avaliacao;
        
        // Verifica se Agendamento existe
        const [agendamento] = await pool.query('SELECT Id FROM Agendamento WHERE Id = ?', [idAgentamento]);
        if (agendamento.length === 0) throw new Error('Agendamento não encontrado');

        // Verifica se Servidor existe
        const [servidor] = await pool.query('SELECT Matricula FROM Servidor WHERE Matricula = ?', [idServidor]);
        if (servidor.length === 0) throw new Error('Servidor não encontrado');

        const [result] = await pool.query('INSERT INTO Avaliacao (Data_hora, idAgentamento, idServidor, Resultado) VALUES (?, ?, ?, ?)', [
            Data_hora,
            idAgentamento,
            idServidor,
            Resultado
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(idAgentamento, idServidor, data_hora) {
        const [result] = await pool.query('DELETE FROM Avaliacao WHERE idAgentamento = ? AND idServidor = ? AND Data_hora = ?', [
            idAgentamento,
            idServidor,
            data_hora
        ]);
        return result.affectedRows > 0;
    }
};

module.exports = Avaliacao;
