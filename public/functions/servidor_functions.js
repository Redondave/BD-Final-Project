const form = document.getElementById('servidorForm');
const servidoresTable = document.getElementById('servidoresTable');
const statusBox = document.getElementById('status');
const servidorIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const dataNascimentoInput = document.getElementById('dataNascimento');
const dataContratoInput = document.getElementById('dataContrato');
const idFuncaoSelect = document.getElementById('idFuncao');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	servidorIdInput.value = '';
	form.reset();
}

// Renderiza a tabela de servidores com os dados recebidos da API
function renderServidores(servidores) {
	servidoresTable.innerHTML = servidores
		.map(
			(servidor) => `
				<tr>
					<td>${servidor.Matricula}</td>
					<td>${servidor.Nome}</td>
					<td>${servidor.Email}</td>
					<td>${servidor.Data_contrato ? servidor.Data_contrato.split('T')[0] : ''}</td>
					<td>${servidor.Funcao}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${servidor.Matricula}">Editar</button>
							<button type="button" data-delete="${servidor.Matricula}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

// Carrega as funções disponíveis e popula o dropdown do formulário
async function loadFuncoes() {
	const response = await fetch('/api/servidores/funcoes');
	const funcoes = await response.json();
	funcoes.forEach((funcao) => {
		const option = document.createElement('option');
		option.value = funcao.Codigo_fn;
		option.textContent = funcao.Nome_fn;
		idFuncaoSelect.appendChild(option);
	});
}

async function loadServidores() {
	const response = await fetch('/api/servidores/view');
	const servidores = await response.json();
	renderServidores(servidores);
}

async function getServidor(Matricula) {
	const response = await fetch(`/api/servidores/view/${Matricula}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um servidor
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome: nomeInput.value.trim(),
		Email: emailInput.value.trim(),
		Senha: senhaInput.value.trim(),
		Data_nascimento: dataNascimentoInput.value,
		Data_contrato: dataContratoInput.value,
		idFuncao: idFuncaoSelect.value,
	};

	const editingMatricula = servidorIdInput.value || null;
	const method = editingMatricula ? 'PUT' : 'POST';
	const url = editingMatricula
		? `/api/servidores/view/${editingMatricula}`
		: '/api/servidores/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save servidor', true);
		return;
	}

	setStatus(editingMatricula ? 'Servidor atualizado' : 'Servidor criado');
	resetForm();
	await loadServidores();
});

servidoresTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Preenche o formulário com os dados do servidor para edição
	if (editId) {
		const servidor = await getServidor(editId);
		servidorIdInput.value = servidor.Matricula;
		nomeInput.value = servidor.Nome;
		emailInput.value = servidor.Email;
		senhaInput.value = servidor.Senha || '';
		dataNascimentoInput.value = servidor.Data_nascimento
			? servidor.Data_nascimento.split('T')[0]
			: '';
		dataContratoInput.value = servidor.Data_contrato
			? servidor.Data_contrato.split('T')[0]
			: '';
		idFuncaoSelect.value = servidor.idFuncao;
		setStatus('Editando servidor');
	}

	// Deleta o servidor e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/servidores/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete servidor', true);
			return;
		}

		setStatus('Servidor excluído');
		resetForm();
		await loadServidores();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Edição cancelada');
});

function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

async function initServidoresPage() {
	try {
		await loadFuncoes();
		await loadServidores();
	} catch {
		setStatus('Não foi possível carregar os servidores. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initServidoresPage();
});
