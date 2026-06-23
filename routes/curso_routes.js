const express = require('express');
const cursoController = require('../controller/curso_controller');

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

// Define os Endpoints para o recurso "curso" e associa as ações do controller
router.get('/view', cursoController.list);
router.get('/view/:sigla', cursoController.getBySigla);
router.post('/view', cursoController.create);
router.put('/view/:sigla', cursoController.update);
router.delete('/view/:sigla', cursoController.remove);

module.exports = router;
