const form = document.getElementById('departamentoForm');
const departamentosTable = document.getElementById('departamentoTable');
const statusBox = document.getElementById('status');
const departamentoIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const siglaInput = document.getElementById('sigla');
const localInput = document.getElementById('Local');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	departamentoIdInput.value = '';
	form.reset();
	siglaInput.disabled = false; // Reabilita o campo de sigla ao resetar o formulário
}

// Renderiza a tabela de departamentos com os dados recebidos da API
function renderDepartamentos(departamentos) {
	departamentosTable.innerHTML = departamentos
		.map(
			(departamento) => `
				<tr>
					<td>${departamento.Nome_dep}</td>
					<td>${departamento.Sigla_dep}</td>
					<td>${departamento.Local_fisico}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${departamento.Sigla_dep}">Editar</button>
							<button type="button" data-delete="${departamento.Sigla_dep}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

async function loadDepartamentos() {
	const response = await fetch('/api/departamentos/view');
	const departamentos = await response.json();
	renderDepartamentos(departamentos);
}

async function getDepartamento(Sigla) {
	const response = await fetch(`/api/departamentos/view/${Sigla}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um departamento
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome_dep: nomeInput.value.trim(),
		Sigla_dep: siglaInput.value.trim(),
		Local_fisico: localInput.value.trim(),
	};

	const editingSigla = departamentoIdInput.value || null;
	const method = editingSigla ? 'PUT' : 'POST';
	const url = editingSigla
		? `/api/departamentos/view/${editingSigla}`
		: '/api/departamentos/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save departamento', true);
		return;
	}

	setStatus(editingSigla ? 'Departamento atualizado' : 'Departamento criado');
	resetForm();
	await loadDepartamentos();
});

departamentosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Preenche o formulário com os dados do departamento para edição
	if (editId) {
		const departamento = await getDepartamento(editId);
		nomeInput.value = departamento.Nome_dep;
		localInput.value = departamento.Local_fisico || '';
		siglaInput.value = departamento.Sigla_dep;
		departamentoIdInput.value = departamento.Sigla_dep;
		siglaInput.disabled = true; // Desabilita o campo de sigla durante a edição
		setStatus('Editando departamento');
	}

	// Deleta o departamento e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/departamentos/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete departamento', true);
			return;
		}

		setStatus('Departamento excluído');
		resetForm();
		await loadDepartamentos();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Edição cancelada');
	siglaInput.disabled = false;
});

function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

async function initDepartamentosPage() {
	try {
		await loadDepartamentos();
	} catch {
		setStatus('Não foi possível carregar os departamentos. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initDepartamentosPage();
});
