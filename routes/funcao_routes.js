const express = require('express');
const funcaoController = require('../controller/funcao_controller');

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

// Define os Endpoints para o recurso "funcao" e associa as ações do controller
router.get('/view', funcaoController.list);
router.get('/view/:codigo', funcaoController.getByCodigo);
router.post('/view', funcaoController.create);
router.put('/view/:codigo', funcaoController.update);
router.delete('/view/:codigo', funcaoController.remove);

module.exports = router;
