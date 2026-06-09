const { adminPool } = require('../config/database');
const path = require('path');

// Serve a página de login
async function showLoginForm(req, res) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
}

// Processa a tentativa de login fazendo consulta ao banco de dados para verificar as credenciais
async function login(req, res) {
    const { Matricula, Senha } = req.body;

    if (!Matricula || !Senha) {
        return res.status(400).json({ error: 'Matricula and Senha are required' });
    }

    const matricula = String(Matricula).trim();
    const senha = String(Senha).trim();

    try {
        const [rows] = await adminPool.query(
            'SELECT Matricula, Nome, Email FROM usuario WHERE Matricula = ? AND Senha = ? LIMIT 1',
            [matricula, senha],
        );

        // login bem-sucedido se encontrar um usuário correspondente e redirecionamento, caso contrário retorna erro de autenticação e volta pra login
        if (rows.length > 0) {
            res.status(200).json({ message: 'Login successful', user: rows[0] });
            return res.redirect('/api/usuarios');
        }

        else {
            res.status(401).json({ error: 'Invalid Matricula or Senha' });
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