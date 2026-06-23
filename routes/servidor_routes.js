const express = require('express');
const servidorController = require('../controller/servidor_controller');
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

// Define os Endpoints para o recurso "servidor" e associa as ações do controller
router.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'servidores.html'));
});

router.get('/funcoes', servidorController.listFuncoes);
router.get('/view', servidorController.list);
router.get('/view/:matricula', servidorController.getByMatricula);
router.post('/view', servidorController.create);
router.put('/view/:matricula', servidorController.update);
router.delete('/view/:matricula', servidorController.remove);

module.exports = router;
