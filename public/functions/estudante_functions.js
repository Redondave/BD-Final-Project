const form = document.getElementById('estudanteForm');
const estudantesTable = document.getElementById('estudantesTable');
const statusBox = document.getElementById('status');
const estudanteIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const dataNascimentoInput = document.getElementById('dataNascimento');
const semestreInput = document.getElementById('semestre');
const idCurso = document.getElementById('idCurso');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	estudanteIdInput.value = '';
	form.reset();
}

// Renderiza a tabela de estudantes com os dados recebidos da API
function renderEstudantes(estudantes) {
	estudantesTable.innerHTML = estudantes
		.map(
			(estudante) => `
				<tr>
					<td>${estudante.Nome}</td>
					<td>${estudante.Matricula}</td>
					<td>${estudante.Semestre}</td>
					<td>${estudante.idCurso}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${estudante.Matricula}">Editar</button>
							<button type="button" data-delete="${estudante.Matricula}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

// Carrega as funções disponíveis e popula o dropdown do formulário
async function loadCursos() {
	const response = await fetch('/api/estudantes/cursos');
	const cursos = await response.json();
	cursos.forEach((curso) => {
		const option = document.createElement('option');
		option.value = curso.Sigla_curso;
		option.textContent = curso.Nome_curso;
		idCurso.appendChild(option);
	});
}

async function loadEstudantes() {
	const response = await fetch('/api/estudantes/view');
	const estudantes = await response.json();
	renderEstudantes(estudantes);
}

async function getEstudante(Matricula) {
	const response = await fetch(`/api/estudantes/view/${Matricula}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um estudante
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome: nomeInput.value.trim(),
		Email: emailInput.value.trim(),
		Senha: senhaInput.value.trim(),
		Data_nascimento: dataNascimentoInput.value,
        Semestre: semestreInput.value,
        idCurso: idCurso.value,
	};

	const editingMatricula = estudanteIdInput.value || null;
	const method = editingMatricula ? 'PUT' : 'POST';
	const url = editingMatricula
		? `/api/estudantes/view/${editingMatricula}`
		: '/api/estudantes/view';

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

	setStatus(editingMatricula ? 'Estudante atualizado' : 'Estudante criado');
	resetForm();
	await loadEstudantes();
});

estudantesTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Preenche o formulário com os dados do servidor para edição
	if (editId) {
		const estudante = await getEstudante(editId);
		estudanteIdInput.value = estudante.Matricula;
		nomeInput.value = estudante.Nome;
		emailInput.value = estudante.Email;
		senhaInput.value = estudante.Senha || '';
		dataNascimentoInput.value = estudante.Data_nascimento
			? estudante.Data_nascimento.split('T')[0]
			: '';
		idCurso.value = estudante.idCurso || '';
		semestreInput.value = estudante.Semestre || '';
		estudanteIdInput.disabled = true;
		nomeInput.disabled = true;
		emailInput.disabled = true;
		senhaInput.disabled = true;
		dataNascimentoInput.disabled = true;
		setStatus('Editando estudante');
	}

	// Deleta o estudante e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/estudantes/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete estudante', true);
			return;
		}

		setStatus('Estudante excluído');
		resetForm();
		await loadEstudantes();
	}
});

cancelBtn.addEventListener('click', () => {
	resetForm();
	setStatus('Edição cancelada');
	estudanteIdInput.disabled = false;
	nomeInput.disabled = false;
	emailInput.disabled = false;
	senhaInput.disabled = false;
	dataNascimentoInput.disabled = false;
});

function setStatus(message, isError = false) {
	statusBox.textContent = message;
	statusBox.style.color = isError ? 'red' : 'green';
}

async function initEstudantesPage() {
	try {
		await loadCursos();
		await loadEstudantes();
	} catch {
		setStatus('Não foi possível carregar os estudantes. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initEstudantesPage();
});
