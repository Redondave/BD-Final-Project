const express = require('express');
const path = require('path');
const session = require('express-session')

// Importa as rotas das entidades
const usuarioRoutes = require('./routes/usuario_routes');
const loginRoute = require('./routes/login_route');
const homepageRoute = require('./routes/homepage_route');

const app = express();

// Configurações do Express para lidar com JSON, dados de formulário e arquivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura a sessão de usuário para evitar navegação livre entre os endpoints
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUnitialized: true
}));


// Configura o diretório para arquivos estáticos (HTML, CSS, JS) e para as fotos dos usuários
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Rota para acessar as fotos dos usuários

// Redireciona a raiz para a página de login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Registra as rotas para cada entidade
app.use('/api/usuarios', usuarioRoutes);
app.use('/login', loginRoute);
app.use('/home', homepageRoute);


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;