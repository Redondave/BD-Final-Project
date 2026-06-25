const express = require('express');

const router = express.Router();

// Define os Endpoints para o recurso "login" e associa as ações do controller
router.post('/', (req, res) => {
    // Limpa a sessão do usuário
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao destruir a sessão:', err);
            }
            res.json({ message: 'Logout realizado com sucesso' });
        });
    } else {
        res.json({ message: 'Nenhuma sessão ativa' });
    }
});

module.exports = router;