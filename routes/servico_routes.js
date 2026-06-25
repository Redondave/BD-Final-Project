const express = require('express');
const servicoController = require('../controller/servico_controller');
const path = require('path');

const router = express.Router();

// Middleware para validar a sessão do usuário
const validateSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Aplica o middleware de validação de sessão a todas as rotas deste router
router.use(validateSession);

router.get('/', (req, res) => {  
  return res.sendFile(path.join(__dirname, '..', 'public', 'servicos.html'));
});

// Define os Endpoints para o recurso "servico" e associa as ações do controller
router.get('/view', servicoController.list);
router.get('/view/:codigo', servicoController.getByCodigo);
router.post('/view', servicoController.create);
router.put('/view/:codigo', servicoController.update);
router.delete('/view/:codigo', servicoController.remove);

module.exports = router;
