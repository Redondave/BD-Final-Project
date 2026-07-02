const form = document.getElementById('ofertaForm');
const ofertasTable = document.getElementById('ofertasTable');
const statusBox = document.getElementById('status');
const idDepartamentoInput = document.getElementById('idDepartamento');
const idOfertaInput = document.getElementById('editingId');
const idServicoInput = document.getElementById('idServico');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	idOfertaInput.value = '';
	form.reset();
}

// Renderiza a tabela de usuários com os dados recebidos da API (usuários) e adiciona botões de ação para cada usuário
function renderOfertas(ofertas) {
	ofertasTable.innerHTML = ofertas
		.map(
			(oferta) => `
				<tr>
					<td>${oferta.Nome_dep}</td>
					<td>${oferta.Nome_serv}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${oferta.Sigla_dep}/${oferta.Codigo_serv}" class="primary">Editar</button>
							<button type="button" data-delete="${oferta.Sigla_dep}/${oferta.Codigo_serv}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

// Carrega os serviços disponíveis e popula o dropdown do formulário
async function loadServicos() {
	const response = await fetch('/api/oferece/servicos');
	const servicos = await response.json();
	servicos.forEach((servico) => {
		const option = document.createElement('option');
		option.value = servico.Codigo_serv;
		option.textContent = servico.Nome_serv;
		idServicoInput.appendChild(option);
	});
}

// Carrega os departamentos disponíveis e popula o dropdown do formulário
async function loadDepartamentos() {
	const response = await fetch('/api/oferece/departamentos');
	const departamentos = await response.json();
	console.log('Departamentos:', departamentos); 
	departamentos.forEach((departamento) => {
		console.log('Adding departamento:', departamento);
		const option = document.createElement('option');
		option.value = departamento.Sigla_dep;
		option.textContent = departamento.Nome_dep;
		idDepartamentoInput.appendChild(option);
	});
}

// Pega o resultado da API (json) e chama a função de render
async function loadOferece() {
	console.log('Loading ofertas...');
	const response = await fetch('/api/oferece/view');
	console.log('Response status:', response.status);
	const ofertas = await response.json();
	renderOfertas(ofertas);
}

async function getOferta(path) {
	const response = await fetch(`/api/oferece/view/${path}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um usuário, fazendo a requisição correspondente à API e atualizando a tabela de usuários após a operação
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Sigla_dep: idDepartamentoInput.value,
		Codigo_serv: idServicoInput.value,
	};

	const editingSigla = idOfertaInput.value || null;
	const method = editingSigla ? 'PUT' : 'POST';
	const url = editingSigla
		? `/api/oferece/view/${editingSigla}`
		: '/api/oferece/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save oferta', true);
		return;
	}

	setStatus(editingSigla ? 'Oferta atualizada' : 'Oferta criada');
	resetForm();
	await loadOferece();
});

ofertasTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Caso o botão seja o de editar, preenche o formulário com os dados da solicitação para edição
	if (editId) {
		const oferta = await getOferta(editId);
		console.log('Editing oferta:', oferta);
		idOfertaInput.value = `${oferta[0].Sigla_dep}/${oferta[0].Codigo_serv}`;
		idDepartamentoInput.value = oferta[0].Sigla_dep;
		idServicoInput.value = oferta[0].Codigo_serv;
		setStatus('Editing oferta');
	}

	// Caso o botão seja o de excluir, faz a requisição para deletar a solicitação e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/oferece/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete oferta', true);
			return;
		}

		setStatus('Oferta deleted');
		resetForm();

		// Atualiza a tabela de ofertas após a exclusão
		await loadOferece();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Editing canceled');
});

// Inicializa a página carregando os usuários e exibindo mensagens de status em caso de falha
async function initOferecePage() {
	try {
		await loadServicos();
		await loadDepartamentos();
		console.log('Loading ofertas...');
		await loadOferece();
	} catch {
		setStatus('Could not load ofertas. Check the API and database.', true);
	}
}

// Exibe mensagens de status para o usuário, indicando sucesso ou erro nas operações realizadas
function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

// Certifica-se de que a função de inicialização seja chamada quando o conteúdo da página for carregado, garantindo que a tabela de usuários seja renderizada corretamente
document.addEventListener('DOMContentLoaded', () => {
	initOferecePage();
});
