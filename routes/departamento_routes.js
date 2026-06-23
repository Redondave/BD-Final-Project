const express = require('express');
const departamentoController = require('../controller/departamento_controller');

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

// Define os Endpoints para o recurso "departamento" e associa as ações do controller
router.get('/view', departamentoController.list);
router.get('/view/:sigla', departamentoController.getBySigla);
router.post('/view', departamentoController.create);
router.put('/view/:sigla', departamentoController.update);
router.delete('/view/:sigla', departamentoController.remove);

module.exports = router;
