const express = require('express');
const path = require('path');

// Importa as rotas das entidades
const usuarioRoutes = require('../routes/usuario.routes');

const app = express();

// Configurações do Express para lidar com JSON, dados de formulário e arquivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registra as rotas para cada entidade
app.use('/api/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;