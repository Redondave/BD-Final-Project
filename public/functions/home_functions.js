const logoutButton = document.getElementById('logoutBtn');

logoutButton.addEventListener('click', async () => {
  try {
    // Chama a API de logout para limpar a sessão no backend
    const response = await fetch('/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    // Redireciona para a página de login após o logout
    window.location.replace('/login.html');
    
  } catch (error) {
    console.error('Logout error:', error);
    // Força o redirecionamento para a página de login mesmo em caso de erro
    window.location.replace('/login.html');
  }
});
