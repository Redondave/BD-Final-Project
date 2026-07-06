const form = document.getElementById('avaliacaoForm');
const avaliacoesTable = document.getElementById('avaliacoesTable');
const statusBox = document.getElementById('status');
const agendamentoSelect = document.getElementById('idAgentamento');
const servidorSelect = document.getElementById('idServidor');
const dataHoraInput = document.getElementById('dataHora');
const resultadoSelect = document.getElementById('resultado');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	form.reset();
}

function renderAvaliacoes(avaliacoes) {
	avaliacoesTable.innerHTML = avaliacoes
		.map(
			(avaliacao) => {
				const formattedDate = avaliacao.Data_hora ? avaliacao.Data_hora : '';
				const resultadoTexto = avaliacao.Resultado ? 'Sim' : 'Não';
				return `
				<tr>
					<td>${formattedDate}</td>
					<td>${avaliacao.Lugar || 'Agendamento ' + avaliacao.idAgentamento}</td>
					<td>${avaliacao.Nome_Servidor} (Matrícula: ${avaliacao.idServidor})</td>
					<td>${resultadoTexto}</td>
					<td>
						<div class="actions">
							<button type="button" data-delete-agendamento="${avaliacao.idAgentamento}" data-delete-servidor="${avaliacao.idServidor}" data-delete-datahora="${avaliacao.Data_hora}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`;
			}
		)
		.join('');
}

async function loadAgendamentos() {
	const response = await fetch('/api/agendamentos/view');
	const agendamentos = await response.json();
	agendamentos.forEach((agendamento) => {
		const option = document.createElement('option');
		option.value = agendamento.Id;
		const formattedDate = agendamento.Data_hora ? agendamento.Data_hora.split('T')[0] : '';
		option.textContent = `ID: ${agendamento.Id} - ${agendamento.Lugar} (${formattedDate})`;
		agendamentoSelect.appendChild(option);
	});
}

async function loadServidores() {
	const response = await fetch('/api/servidores/view');
	const servidores = await response.json();
	servidores.forEach((servidor) => {
		const option = document.createElement('option');
		option.value = servidor.Matricula;
		option.textContent = `${servidor.Nome} (Matrícula: ${servidor.Matricula})`;
		servidorSelect.appendChild(option);
	});
}

async function loadAvaliacoes() {
	const response = await fetch('/api/avaliacoes/view');
	const avaliacoes = await response.json();
	renderAvaliacoes(avaliacoes);
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	// O formato retornado do datetime-local é YYYY-MM-DDTHH:MM. 
	// Vamos converter o T em espaço e adicionar :00 para o formato MySQL DATETIME YYYY-MM-DD HH:MM:SS
	let dataHoraValue = dataHoraInput.value.replace('T', ' ');
	if (dataHoraValue.length === 16) {
		dataHoraValue += ':00';
	}

	const payload = {
		Data_hora: dataHoraValue,
		idAgentamento: parseInt(agendamentoSelect.value, 10),
		idServidor: parseInt(servidorSelect.value, 10),
		Resultado: parseInt(resultadoSelect.value, 10) === 1,
	};

	const response = await fetch('/api/avaliacoes/view', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Não foi possível salvar a avaliação', true);
		return;
	}

	setStatus('Avaliação criada com sucesso');
	resetForm();
	await loadAvaliacoes();
});

avaliacoesTable.addEventListener('click', async (event) => {
	const deleteAgendamento = event.target.dataset.deleteAgendamento;
	const deleteServidor = event.target.dataset.deleteServidor;
	const deleteDatahora = event.target.dataset.deleteDatahora;

	if (deleteAgendamento && deleteServidor && deleteDatahora) {
		const encodedDatahora = encodeURIComponent(deleteDatahora);
		const response = await fetch(`/api/avaliacoes/view/${deleteAgendamento}/${deleteServidor}/${encodedDatahora}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Não foi possível excluir a avaliação', true);
			return;
		}

		setStatus('Avaliação excluída com sucesso');
		await loadAvaliacoes();
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

async function initAvaliacoesPage() {
	try {
		await loadAgendamentos();
		await loadServidores();
		await loadAvaliacoes();
	} catch (error) {
		setStatus('Não foi possível carregar os dados. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initAvaliacoesPage();
});
