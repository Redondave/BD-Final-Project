const form = document.getElementById('solicitacaoForm');
const solicitacoesTable = document.getElementById('solicitacoesTable');
const statusBox = document.getElementById('status');
const solicitacaoIdInput = document.getElementById('editingId');
const estudanteInput = document.getElementById('estudante');
const dataInput = document.getElementById('data');
const idServicoInput = document.getElementById('idServico');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	solicitacaoIdInput.value = '';
	form.reset();
}

// Renderiza a tabela de usuários com os dados recebidos da API (usuários) e adiciona botões de ação para cada usuário
function renderSolicitacoes(solicitacoes) {
	solicitacoesTable.innerHTML = solicitacoes
		.map(
			(solicitacao) => `
				<tr>
					<td>${solicitacao.Senha}</td>
					<td>${solicitacao.Nome_Estudante}</td>
					<td>${solicitacao.Data_emissao ? solicitacao.Data_emissao.split('T')[0] : ''}</td>
					<td>${solicitacao.Nome_serv}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${solicitacao.Senha}">Editar</button>
							<button type="button" data-delete="${solicitacao.Senha}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

// Carrega os serviços disponíveis e popula o dropdown do formulário
async function loadServicos() {
	const response = await fetch('/api/solicitacoes/servicos');
	const servicos = await response.json();
	servicos.forEach((servico) => {
		const option = document.createElement('option');
		option.value = servico.Codigo_serv;
		option.textContent = servico.Nome_serv;
		idServicoInput.appendChild(option);
	});
}

// Carrega os estudantes disponíveis e popula o dropdown do formulário
async function loadEstudantes() {
	const response = await fetch('/api/solicitacoes/estudantes');
	const estudantes = await response.json();
	estudantes.forEach((estudante) => {
		const option = document.createElement('option');
		option.value = estudante.Matricula;
		option.textContent = estudante.Nome;
		estudanteInput.appendChild(option);
	});
}

// Pega o resultado da API (json) e chama a função de render
async function loadSolicitacoes() {
	console.log('Loading solicitacoes...');
	const response = await fetch('/api/solicitacoes/view');
	console.log('Response status:', response.status);
	const solicitacoes = await response.json();
	renderSolicitacoes(solicitacoes);
}

async function getSolicitacao(Senha) {
	const response = await fetch(`/api/solicitacoes/view/${Senha}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um usuário, fazendo a requisição correspondente à API e atualizando a tabela de usuários após a operação
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		idEstudante: estudanteInput.value,
		Codigo_serv: idServicoInput.value,
		Data_emissao: dataInput.value,
	};

	const editingSenha = solicitacaoIdInput.value || null;
	const method = editingSenha ? 'PUT' : 'POST';
	const url = editingSenha
		? `/api/solicitacoes/view/${editingSenha}`
		: '/api/solicitacoes/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save solicitacao', true);
		return;
	}

	setStatus(editingSenha ? 'Solicitacao atualizada' : 'Solicitacao criada');
	resetForm();
	await loadSolicitacoes();
});

solicitacoesTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Caso o botão seja o de editar, preenche o formulário com os dados da solicitação para edição
	if (editId) {
		const solicitacao = await getSolicitacao(editId);
		solicitacaoIdInput.value = solicitacao.Senha;
		estudanteInput.value = solicitacao.idEstudante;
		dataInput.value = solicitacao.Data_emissao ? solicitacao.Data_emissao.split('T')[0] : '';
		idServicoInput.value = solicitacao.Codigo_serv;
		setStatus('Editing solicitacao');
	}

	// Caso o botão seja o de excluir, faz a requisição para deletar a solicitação e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/solicitacoes/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete solicitacao', true);
			return;
		}

		setStatus('Solicitacao deleted');
		resetForm();

		// Atualiza a tabela de solicitacoes após a exclusão
		await loadSolicitacoes();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Editing canceled');
});

// Inicializa a página carregando os usuários e exibindo mensagens de status em caso de falha
async function initSolicitacoesPage() {
	try {
		await loadServicos();
		await loadEstudantes();
		console.log('Loading solicitacoes...');
		await loadSolicitacoes();
	} catch {
		setStatus('Could not load solicitacoes. Check the API and database.', true);
	}
}

// Exibe mensagens de status para o usuário, indicando sucesso ou erro nas operações realizadas
function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

// Certifica-se de que a função de inicialização seja chamada quando o conteúdo da página for carregado, garantindo que a tabela de usuários seja renderizada corretamente
document.addEventListener('DOMContentLoaded', () => {
	initSolicitacoesPage();
});
