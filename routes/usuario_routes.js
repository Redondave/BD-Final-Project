const express = require('express');
const path = require('path');

const usuarioController = require('../controller/usuario_controller');

const router = express.Router();

// Define os Endpoints para o recurso "usuario" e associa as ações do controller
router.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'users.html'));
});
router.get('/view', usuarioController.list);
router.get('/view/:matricula', usuarioController.getByMatricula);
router.post('/view', usuarioController.create);
router.put('/view/:matricula', usuarioController.update);
router.delete('/view/:matricula', usuarioController.remove);

module.exports = router;