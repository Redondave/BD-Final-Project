const form = document.getElementById('usuarioForm');
const usuariosTable = document.getElementById('usuariosTable');
const statusBox = document.getElementById('status');
const usuarioIdInput = document.getElementById('usuarioId');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const cancelBtn = document.getElementById('cancelBtn');

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
					<td>${usuario.id}</td>
					<td>${usuario.nome}</td>
					<td>${usuario.email}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${usuario.id}">Editar</button>
							<button type="button" data-delete="${usuario.id}" class="secondary">Excluir</button>
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

async function getUsuario(id) {
	const response = await fetch(`/api/usuarios/${id}`);
	return response.json();
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		nome: nomeInput.value.trim(),
		email: emailInput.value.trim(),
	};

	const id = usuarioIdInput.value;
	const method = id ? 'PUT' : 'POST';
	const url = id ? `/api/usuarios/${id}` : '/api/usuarios';

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

	setStatus(id ? 'Usuario updated' : 'Usuario created');
	resetForm();
	await loadUsuarios();
});

usuariosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	if (editId) {
		const usuario = await getUsuario(editId);
		usuarioIdInput.value = usuario.id;
		nomeInput.value = usuario.nome;
		emailInput.value = usuario.email;
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
