const express = require('express');
const multer = require('multer'); // Middleware para gerenciar a foto
const path = require('path');

const usuarioController = require('../controller/usuario_controller');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para validar a sessão do usuário
const validateSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Aplica o middleware de validação de sessão a todas as rotas deste router
router.use(validateSession);

// Define os Endpoints para o recurso "usuario" e associa as ações do controller
router.get('/', (req, res) => {  
  return res.sendFile(path.join(__dirname, '..', 'public', 'users.html'));
});

router.get('/view', usuarioController.list);
router.get('/view/:matricula', usuarioController.getByMatricula);
router.post('/view', upload.single('Foto'), usuarioController.create);
router.put('/view/:matricula', upload.single('Foto'), usuarioController.update);
router.delete('/view/:matricula', usuarioController.remove);
router.get('/foto/:matricula', usuarioController.getFoto);

module.exports = router;