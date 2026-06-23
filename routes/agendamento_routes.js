const express = require('express');
const agendamentoController = require('../controller/agendamento_controller');

const router = express.Router();

const validateSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

router.use(validateSession);

router.get('/view', agendamentoController.list);
router.get('/view/:id', agendamentoController.getById);
router.post('/view', agendamentoController.create);
router.put('/view/:id', agendamentoController.update);
router.delete('/view/:id', agendamentoController.remove);

module.exports = router;
