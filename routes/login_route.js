const express = require('express');
const loginController = require('../controller/login_controller');

const router = express.Router();

// Define os Endpoints para o recurso "login" e associa as ações do controller
router.get('/', loginController.showLoginForm);
router.post('/', loginController.login);

module.exports = router;