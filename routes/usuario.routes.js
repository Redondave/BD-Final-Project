const express = require('express');

const usuarioController = require('../controller/usuario.controller');

const router = express.Router();

// Define os Endpoints para o recurso "usuario" e associa as ações do controller
router.get('/', usuarioController.list);
router.get('/:id', usuarioController.getById);
router.post('/', usuarioController.create);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.remove);

module.exports = router;