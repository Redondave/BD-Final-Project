const express = require('express');
const solicitacaoController = require('../controller/solicitacao_controller');
const path = require('path');

const router = express.Router();

const validateSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

router.use(validateSession);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'solicitacao.html'));
});

router.get('/servicos', solicitacaoController.listServicos);
router.get('/estudantes', solicitacaoController.listEstudantes);
router.get('/view', solicitacaoController.list);
router.get('/view/:senha', solicitacaoController.getBySenha);
router.get('/estudante/:matricula', solicitacaoController.getByEstudante);
router.post('/view', solicitacaoController.create);
router.put('/view/:senha', solicitacaoController.update);
router.delete('/view/:senha', solicitacaoController.remove);

module.exports = router;
