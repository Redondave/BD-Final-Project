const db = require('../config/database');
const pool = db.appPool;

const Solicitacao = {
    findAll: async function() {
        const [result] = await pool.query(`SELECT s.*, serv.Nome_serv, u.Nome AS Nome_Estudante
            FROM Solicitacao s
            JOIN Servico serv ON s.Codigo_serv = serv.Codigo_serv
            JOIN Usuario u ON s.idEstudante = u.Matricula`);
    
        return result;
    },

    findBySenha: async function(senha) {
        const [rows] = await pool.query(`
            SELECT s.*, serv.Nome_serv 
            FROM Solicitacao s
            JOIN Servico serv ON s.Codigo_serv = serv.Codigo_serv
            WHERE s.Senha = ?
        `, [senha]);
        return rows[0] || null;
    },

    findByEstudante: async function(matricula) {
        const [rows] = await pool.query(`
            SELECT s.*, serv.Nome_serv 
            FROM Solicitacao s 
            JOIN Servico serv ON s.Codigo_serv = serv.Codigo_serv
            WHERE s.idEstudante = ?
            ORDER BY s.Data_emissao DESC
        `, [matricula]);
        return rows;
    },

    create: async function(solicitacao) {
        const { idEstudante, Codigo_serv, Data_emissao } = solicitacao;
        
        // Verifica se Estudante existe
        const [estudante] = await pool.query('SELECT Matricula FROM Usuario WHERE Matricula = ?', [idEstudante]);
        if (estudante.length === 0) throw new Error('Estudante não encontrado');

        // Verifica se Servico existe
        const [servico] = await pool.query('SELECT Codigo_serv FROM Servico WHERE Codigo_serv = ?', [Codigo_serv]);
        if (servico.length === 0) throw new Error('Serviço não encontrado');

        const [result] = await pool.query('INSERT INTO Solicitacao (idEstudante, Codigo_serv, Data_emissao) VALUES (?, ?, ?)', [
            idEstudante,
            Codigo_serv,
            Data_emissao
        ]);
        return result.affectedRows > 0;
    },

    update: async function(senha, solicitacao) {
        const { Codigo_serv, Data_emissao } = solicitacao;
        const [result] = await pool.query('UPDATE Solicitacao SET Codigo_serv = ?, Data_emissao = ? WHERE Senha = ?', [
            Codigo_serv,
            Data_emissao,
            senha
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(senha) {
        const [result] = await pool.query('DELETE FROM Solicitacao WHERE Senha = ?', [senha]);
        return result.affectedRows > 0;
    }
};

module.exports = Solicitacao;
