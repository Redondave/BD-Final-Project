const express = require('express');
const ofereceController = require('../controller/oferece_controller');
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
  return res.sendFile(path.join(__dirname, '..', 'public', 'oferece.html'));
});

router.get('/view', ofereceController.list);
router.get('/departamento/:sigla', ofereceController.getByDepartamento);
router.get('/servico/:codigo', ofereceController.getByServico);
router.post('/view', ofereceController.create);
router.delete('/view/:sigla/:codigo', ofereceController.remove);

module.exports = router;
