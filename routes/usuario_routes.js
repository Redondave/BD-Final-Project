const express = require('express');

const usuarioController = require('../controller/usuario_controller');

const router = express.Router();

// Define os Endpoints para o recurso "usuario" e associa as ações do controller
router.get('/', usuarioController.list);
router.get('/:matricula', usuarioController.getByMatricula);
router.post('/', usuarioController.create);
router.put('/:matricula', usuarioController.update);
router.delete('/:matricula', usuarioController.remove);

module.exports = router;