const db = require('../config/database');
const pool = db.appPool;

const Oferece = {
    findAll: async function() {
        const [rows] = await pool.query(`
            SELECT o.*, d.Nome_dep, s.Nome_serv
            FROM Oferece o
            JOIN Departamento d ON o.Sigla_dep = d.Sigla_dep
            JOIN Servico s ON o.Codigo_serv = s.Codigo_serv
        `);
        return rows;
    },

    findByDepartamento: async function(sigla) {
        const [rows] = await pool.query(`
            SELECT o.*, s.Nome_serv, s.Descricao_serv 
            FROM Oferece o
            JOIN Servico s ON o.Codigo_serv = s.Codigo_serv
            WHERE o.Sigla_dep = ?
        `, [sigla]);
        return rows;
    },

    findByServico: async function(codigo) {
        const [rows] = await pool.query(`
            SELECT o.*, d.Nome_dep 
            FROM Oferece o
            JOIN Departamento d ON o.Sigla_dep = d.Sigla_dep
            WHERE o.Codigo_serv = ?
        `, [codigo]);
        return rows;
    },

    create: async function(oferece) {
        const { Sigla_dep, Codigo_serv } = oferece;
        
        // Verifica se Departamento existe
        const [departamento] = await pool.query('SELECT Sigla_dep FROM Departamento WHERE Sigla_dep = ?', [Sigla_dep]);
        if (departamento.length === 0) throw new Error('Departamento não encontrado');

        // Verifica se Servico existe
        const [servico] = await pool.query('SELECT Codigo_serv FROM Servico WHERE Codigo_serv = ?', [Codigo_serv]);
        if (servico.length === 0) throw new Error('Serviço não encontrado');

        const [result] = await pool.query('INSERT INTO Oferece (Sigla_dep, Codigo_serv) VALUES (?, ?)', [
            Sigla_dep,
            Codigo_serv
        ]);
        return result.affectedRows > 0;
    },

    remove: async function(sigla, codigo) {
        const [result] = await pool.query('DELETE FROM Oferece WHERE Sigla_dep = ? AND Codigo_serv = ?', [
            sigla,
            codigo
        ]);
        return result.affectedRows > 0;
    }
};

module.exports = Oferece;
