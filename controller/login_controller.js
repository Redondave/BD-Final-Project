const db = require('../config/database');
const pool = db.appPool;
const path = require('path');

// Serve a página de login
const showLoginForm = async(req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
}

// Processa a tentativa de login fazendo consulta ao banco de dados para verificar as credenciais
const login = async(req, res) => {
    const { Matricula, Senha } = req.body;
    console.log('Login attempt with Matricula:', Matricula);

    if (!Matricula || !Senha) {
        return res.status(400).json({ error: 'Matricula and Senha are required' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT Matricula, Nome, Email FROM Usuario WHERE Matricula = ? AND Senha = ? LIMIT 1',
            [Matricula, Senha],
        );

        // login bem-sucedido se encontrar um usuário correspondente e redirecionamento, caso contrário retorna erro de autenticação e volta pra login
        if (rows.length > 0) {
            console.log('Login successful for Matricula:', Matricula);
            return res.redirect('/api/usuarios');
        }

        else {
            console.log('Login failed for Matricula:', Matricula);
            return res.redirect('/');
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    showLoginForm,
    login,
};