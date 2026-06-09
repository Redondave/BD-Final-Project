const form = document.getElementById('usuarioForm');
const loginForm = document.getElementById('loginForm');
const usuariosTable = document.getElementById('usuariosTable');
const statusBox = document.getElementById('status');
const usuarioIdInput = document.getElementById('usuarioId');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const cancelBtn = document.getElementById('cancelBtn');

// Event listener para o formulário de login
loginForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	// Faz a tramitação dos dados de login e envia a requisição para o backend
	const payload = {
		Matricula: usuarioIdInput.value.trim(),
		Senha: nomeInput.value.trim(),
	};
	const response = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const result = await response.json().catch(() => ({}));

	if (!response.ok) {
		setStatus(result.error || 'Unable to login', true);
		return;
	}

	setStatus('Login successful');
});

function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? '#b91c1c' : '#065f46';
}

function resetForm() {
	usuarioIdInput.value = '';
	form.reset();
}

function renderUsuarios(usuarios) {
	usuariosTable.innerHTML = usuarios
		.map(
			(usuario) => `
				<tr>
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

async function loadUsuarios() {
	const response = await fetch('/api/usuarios');
	const usuarios = await response.json();
	renderUsuarios(usuarios);
}

async function getUsuario(Matricula) {
	const response = await fetch(`/api/usuarios/${Matricula}`);
	return response.json();
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome: nomeInput.value.trim(),
		Email: emailInput.value.trim(),
	};

	const Matricula = usuarioIdInput.value;
	const method = Matricula ? 'PUT' : 'POST';
	const url = Matricula ? `/api/usuarios/${Matricula}` : '/api/usuarios';

	const response = await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const result = await response.json().catch(() => ({}));

	if (!response.ok) {
		setStatus(result.error || 'Unable to save usuario', true);
		return;
	}

	setStatus(Matricula ? 'Usuario updated' : 'Usuario created');
	resetForm();
	await loadUsuarios();
});

usuariosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	if (editId) {
		const usuario = await getUsuario(editId);
		usuarioIdInput.value = usuario.Matricula;
		nomeInput.value = usuario.Nome;
		emailInput.value = usuario.Email;
		setStatus('Editing usuario');
	}

	if (deleteId) {
		const response = await fetch(`/api/usuarios/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete usuario', true);
			return;
		}

		setStatus('Usuario deleted');
		resetForm();
		await loadUsuarios();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Editing canceled');
});

loadUsuarios().catch(() => setStatus('Could not load usuarios. Check the API and database.', true));
