const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    // Previne usuário não logado na sessão
    if (!req.session.user){
      return res.redirect('/login');
    }    
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

module.exports = router;