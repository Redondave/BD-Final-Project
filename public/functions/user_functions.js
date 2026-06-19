const form = document.getElementById('usuarioForm');
const usuariosTable = document.getElementById('usuariosTable');
const statusBox = document.getElementById('status');
const usuarioIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const fotoInput = document.getElementById('foto');
const cancelBtn = document.getElementById('cancelBtn');
const fotoLabel = document.getElementById('fotoLabel');

function resetForm() {
	usuarioIdInput.value = '';
	form.reset();
}

// Renderiza a tabela de usuários com os dados recebidos da API (usuários) e adiciona botões de ação para cada usuário
function renderUsuarios(usuarios) {
	usuariosTable.innerHTML = usuarios
		.map(
			(usuario) => `
				<tr>
					<td><img src="usuarios/foto/${usuario.Matricula}" width=50 height=50></td>
					<td>${usuario.Matricula}</td>
					<td>${usuario.Nome}</td>
					<td>${usuario.Email}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${usuario.Matricula}">Editar</button>
							<button type="button" data-delete="${usuario.Matricula}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

// Pega o resultado da API (json) e chama a função de render
async function loadUsuarios() {
	const response = await fetch('/api/usuarios/view');
	const usuarios = await response.json();
	renderUsuarios(usuarios);
}

async function getUsuario(Matricula) {
	const response = await fetch(`/api/usuarios/view/${Matricula}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um usuário, fazendo a requisição correspondente à API e atualizando a tabela de usuários após a operação
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = new FormData();
	formData.append('Nome', nomeInput.value.trim());
	formData.append('Email', emailInput.value.trim());
	formData.append('Senha', senhaInput.value.trim());

	if (fotoInput.files[0])	formData.append('Foto', fotoInput.files[0]);

	// Verifica se estamos editando um usuário existente (se o campo de matrícula estiver preenchido) ou criando um novo, e define o método HTTP e a URL da requisição de acordo
	const editingMatricula = usuarioIdInput.value || null;
	const method = editingMatricula ? 'PUT' : 'POST';
	const url = editingMatricula ? `/api/usuarios/view/${editingMatricula}` : '/api/usuarios/view';

	const response = await fetch(url, {
		method,
		body : formData
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save usuario', true);
		return;
	}

	setStatus(editingMatricula ? 'Usuario updated' : 'Usuario created');
	resetForm();
	await loadUsuarios();
});

usuariosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Caso o botão seja o de editar, preenche o formulário com os dados do usuário para edição
	if (editId) {
		const usuario = await getUsuario(editId);
		usuarioIdInput.value = usuario.Matricula;
		nomeInput.value = usuario.Nome;
		emailInput.value = usuario.Email;
		senhaInput.value = usuario.Senha;
		setStatus('Editing usuario');
	}

	// Caso o botão seja o de excluir, faz a requisição para deletar o usuário e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/usuarios/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete usuario', true);
			return;
		}

		setStatus('Usuario deleted');
		resetForm();

		// Atualiza a tabela de usuários após a exclusão
		await loadUsuarios();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Editing canceled');
});

// Inicializa a página carregando os usuários e exibindo mensagens de status em caso de falha
async function initUsuariosPage() {
	try {
		await loadUsuarios();
	} catch {
		setStatus('Could not load usuarios. Check the API and database.', true);
	}
}

// Atualiza o nome do arquivo selecionado para upload, melhorando a experiência do usuário ao escolher uma foto para o perfil
fotoInput.addEventListener('change', () => {
	fotoLabel.textContent = fotoInput.files[0] ? fotoInput.files[0].name : 'Escolher Foto';
});

// Exibe mensagens de status para o usuário, indicando sucesso ou erro nas operações realizadas
function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

// Certifica-se de que a função de inicialização seja chamada quando o conteúdo da página for carregado, garantindo que a tabela de usuários seja renderizada corretamente
document.addEventListener('DOMContentLoaded', () => {
	initUsuariosPage();
});
