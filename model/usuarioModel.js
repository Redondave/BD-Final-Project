const db = require('../config/database');

// Define o modelo de usuário com as operações CRUD
const Usuario = {
    findAll: async function() {
    const [rows] = await pool.query('SELECT * FROM usuario ORDER BY id DESC');
    return rows;
    },

    findById: async function(id) {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    return rows[0] || null;
    },

    create: async function(usuario) {
    const { nome, email } = usuario;
    const [result] = await pool.query('INSERT INTO usuario (nome, email) VALUES (?, ?)', [
        nome,
        email,
    ]);

    return { id: result.insertId, nome, email };
    },

    update: async function(id, usuario) {
    const { nome, email } = usuario;
    const [result] = await pool.query('UPDATE usuario SET nome = ?, email = ? WHERE id = ?', [
        nome,
        email,
        id,
    ]);

    return result.affectedRows > 0;
    },

    remove: async function(id) {
    const [result] = await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
    return result.affectedRows > 0;
    }
};

module.exports = Usuario;