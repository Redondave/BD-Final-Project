const express = require('express');
const estudanteController = require('../controller/estudante_controller');
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
  return res.sendFile(path.join(__dirname, '..', 'public', 'estudantes.html'));
});

// Define os Endpoints para o recurso "estudante" e associa as ações do controller
router.get('/cursos', estudanteController.listCursos);
router.get('/view', estudanteController.list);
router.get('/view/:matricula', estudanteController.getByMatricula);
router.post('/view', estudanteController.create);
router.put('/view/:matricula', estudanteController.update);
router.delete('/view/:matricula', estudanteController.remove);

module.exports = router;
