const express = require('express');
const path = require('path');

// Importa as rotas das entidades
const usuarioRoutes = require('../routes/usuario_routes');
const loginRoute = require('../routes/login_route');

const app = express();

// Configurações do Express para lidar com JSON, dados de formulário e arquivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota para servir a página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});


// Registra as rotas para cada entidade
app.use('/api/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;