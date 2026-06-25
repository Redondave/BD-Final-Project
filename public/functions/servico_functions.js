const form = document.getElementById('servicoForm');
const servicosTable = document.getElementById('servicosTable');
const statusBox = document.getElementById('status');
const servicoIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const descricaoInput = document.getElementById('descricao');
const codigoInput = document.getElementById('codigo');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	servicoIdInput.value = '';
	form.reset();
	codigoInput.disabled = false; // Reabilita o campo de código ao resetar o formulário
}

// Renderiza a tabela de servicos com os dados recebidos da API
function renderServicos(servicos) {
	servicosTable.innerHTML = servicos
		.map(
			(servico) => `
				<tr>
					<td>${servico.Nome_serv}</td>
					<td>${servico.Descricao_serv}</td>
					<td>${servico.Codigo_serv}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${servico.Codigo_serv}">Editar</button>
							<button type="button" data-delete="${servico.Codigo_serv}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

async function loadServicos() {
	const response = await fetch('/api/servicos/view');
	const servicos = await response.json();
	renderServicos(servicos);
}

async function getServico(Codigo) {
	const response = await fetch(`/api/servicos/view/${Codigo}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um serviço
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome_serv: nomeInput.value.trim(),
		Descricao_serv: descricaoInput.value.trim(),
		Codigo_serv: codigoInput.value.trim() || null,
	};

	const editingCodigo = servicoIdInput.value || null;
	const method = editingCodigo ? 'PUT' : 'POST';
	const url = editingCodigo
		? `/api/servicos/view/${editingCodigo}`
		: '/api/servicos/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save serviço', true);
		return;
	}

	setStatus(editingCodigo ? 'Serviço atualizado' : 'Serviço criado');
	resetForm();
	await loadServicos();
});

servicosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Preenche o formulário com os dados do serviço para edição
	if (editId) {
		const servico = await getServico(editId);
		servicoIdInput.value = servico.Codigo_serv;
		nomeInput.value = servico.Nome_serv;
		descricaoInput.value = servico.Descricao_serv || '';
		codigoInput.value = servico.Codigo_serv;
		codigoInput.disabled = true; // Desabilita o campo de código durante a edição
		setStatus('Editando serviço');
	}

	// Deleta o serviço e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/servicos/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete serviço', true);
			return;
		}

		setStatus('Serviço excluído');
		resetForm();
		await loadServicos();
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

async function initServicosPage() {
	try {
		await loadServicos();
	} catch {
		setStatus('Não foi possível carregar os serviços. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initServicosPage();
});
