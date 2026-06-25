const form = document.getElementById('funcaoForm');
const funcoesTable = document.getElementById('funcaoTable');
const statusBox = document.getElementById('status');
const funcaoIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const codigoInput = document.getElementById('codigo');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	funcaoIdInput.value = '';
	form.reset();
	codigoInput.disabled = false; // Reabilita o campo de código ao resetar o formulário
}

// Renderiza a tabela de funções com os dados recebidos da API
function renderFuncoes(funcoes) {
	funcoesTable.innerHTML = funcoes
		.map(
			(funcao) => `
				<tr>
					<td>${funcao.Nome_fn}</td>
					<td>${funcao.Codigo_fn}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${funcao.Codigo_fn}">Editar</button>
							<button type="button" data-delete="${funcao.Codigo_fn}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

async function loadFuncoes() {
	const response = await fetch('/api/funcoes/view');
	const funcoes = await response.json();
	renderFuncoes(funcoes);
}

async function getFuncao(Codigo) {
	const response = await fetch(`/api/funcoes/view/${Codigo}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar uma função
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome_fn: nomeInput.value.trim(),
		Codigo_fn: codigoInput.value.trim(),
	};

	const editingCodigo = funcaoIdInput.value || null;
	const method = editingCodigo ? 'PUT' : 'POST';
	const url = editingCodigo
		? `/api/funcoes/view/${editingCodigo}`
		: '/api/funcoes/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save funcao', true);
		return;
	}

	setStatus(editingCodigo ? 'Função atualizada' : 'Função criada');
	resetForm();
	await loadFuncoes();
});

funcoesTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Preenche o formulário com os dados da função para edição
	if (editId) {
		const funcao = await getFuncao(editId);
		nomeInput.value = funcao.Nome_fn;
		codigoInput.value = funcao.Codigo_fn;
		funcaoIdInput.value = funcao.Codigo_fn;
		codigoInput.disabled = true; // Desabilita o campo de código durante a edição
		setStatus('Editando função');
	}

	// Deleta a função e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/funcoes/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete funcao', true);
			return;
		}

		setStatus('Função excluída');
		resetForm();
		await loadFuncoes();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Edição cancelada');
	codigoInput.disabled = false;
});

function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

async function initFuncoesPage() {
	try {
		await loadFuncoes();
	} catch {
		setStatus('Não foi possível carregar as funções. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initFuncoesPage();
	funcaoIdInput.value = '';
});
