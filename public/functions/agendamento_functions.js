const form = document.getElementById('agendamentoForm');
const agendamentosTable = document.getElementById('agendamentosTable');
const statusBox = document.getElementById('status');
const agendamentoIdInput = document.getElementById('editingId');
const lugarInput = document.getElementById('local');
const dataInput = document.getElementById('data');
const solicitacaoInput = document.getElementById('idSolicitacao');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	agendamentoIdInput.value = '';
	form.reset();
}

// Renderiza a tabela de usuários com os dados recebidos da API (usuários) e adiciona botões de ação para cada usuário
function renderAgendamentos(agendamentos) {
	agendamentosTable.innerHTML = agendamentos
		.map(
			(agendamento) => `
				<tr>
					<td>${agendamento.Data_hora ? agendamento.Data_hora.split('T')[0] : ''}</td>
					<td>${agendamento.Lugar}</td>
					<td><a href="solicitacoes/view/${agendamento.idSolicitacao}">${agendamento.idSolicitacao}</a></td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${agendamento.Id}">Editar</button>
							<button type="button" data-delete="${agendamento.Id}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

// Carrega os serviços disponíveis e popula o dropdown do formulário
async function loadSolicitacoes() {
	const response = await fetch('/api/agendamentos/solicitacoes');
	const solicitacoes = await response.json();
	solicitacoes.forEach((solicitacao) => {
		const option = document.createElement('option');
		option.value = solicitacao.Senha;
		option.textContent = solicitacao.Senha;
		solicitacaoInput.appendChild(option);
	});
}

async function loadAgendamentos() {
	const response = await fetch('/api/agendamentos/view');
	const agendamentos = await response.json();
	renderAgendamentos(agendamentos);
}

async function getAgendamento(Senha) {
	const response = await fetch(`/api/agendamentos/view/${Senha}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um usuário, fazendo a requisição correspondente à API e atualizando a tabela de usuários após a operação
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Data_hora: dataInput.value,
		Lugar: lugarInput.value,
		idSolicitacao: solicitacaoInput.value,
	};

	const editingSenha = agendamentoIdInput.value || null;
	const method = editingSenha ? 'PUT' : 'POST';
	const url = editingSenha
		? `/api/agendamentos/view/${editingSenha}`
		: '/api/agendamentos/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save agendamento', true);
		return;
	}

	setStatus(editingSenha ? 'Agendamento atualizado' : 'Agendamento criado');
	resetForm();
	await loadAgendamentos();
});

agendamentosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Caso o botão seja o de editar, preenche o formulário com os dados da solicitação para edição
	if (editId) {
		const agendamento = await getAgendamento(editId);
		agendamentoIdInput.value = agendamento.Id;
		dataInput.value = agendamento.Data_hora ? agendamento.Data_hora.split('T')[0] : '';
		lugarInput.value = agendamento.Lugar;
		solicitacaoInput.value = agendamento.idSolicitacao;
		setStatus('Editing agendamento');
	}

	// Caso o botão seja o de excluir, faz a requisição para deletar a solicitação e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/agendamentos/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete agendamento', true);
			return;
		}

		setStatus('Agendamento deleted');
		resetForm();

		// Atualiza a tabela de agendamentos após a exclusão
		await loadAgendamentos();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Editing canceled');
});

// Inicializa a página carregando os usuários e exibindo mensagens de status em caso de falha
async function initAgendamentosPage() {
	try {
		await loadSolicitacoes();
		await loadAgendamentos();
	} catch (error) {
		setStatus('Could not load agendamentos. Check the API and database.', true);
	}
}

// Exibe mensagens de status para o usuário, indicando sucesso ou erro nas operações realizadas
function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

// Certifica-se de que a função de inicialização seja chamada quando o conteúdo da página for carregado, garantindo que a tabela de usuários seja renderizada corretamente
document.addEventListener('DOMContentLoaded', () => {
	initAgendamentosPage();
});
