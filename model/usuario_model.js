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

    const randomNum = Math.floor(Math.random() * 1000000); // Gera uma matrícula aleatória
    const suffix = randomNum.toString().padStart(6, '0'); // Garante que os 6 dígitos da matrícula após semestre são aleatórios
    const matriculaCompleta = parseInt("261" + suffix, 10); // Formata a matrícula completa
    
    console.log(matriculaCompleta);
    
    const [result] = await pool.query('INSERT INTO Usuario (Nome, Email, Senha, Matricula) VALUES (?, ?, ?, ?)', [
        Nome,
        Email,
        Senha,
        matriculaCompleta
    ]);
    return result.insertId;
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