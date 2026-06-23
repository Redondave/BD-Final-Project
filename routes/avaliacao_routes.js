const express = require('express');
const avaliacaoController = require('../controller/avaliacao_controller');

const router = express.Router();

const validateSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

router.use(validateSession);

router.get('/view', avaliacaoController.list);
router.get('/view/:idAgentamento/:idServidor', avaliacaoController.getByIds);
router.post('/view', avaliacaoController.create);
router.delete('/view/:idAgentamento/:idServidor/:data_hora', avaliacaoController.remove);

module.exports = router;
