const form = document.getElementById('cursoForm');
const cursosTable = document.getElementById('cursoTable');
const statusBox = document.getElementById('status');
const cursoIdInput = document.getElementById('editingId');
const nomeInput = document.getElementById('nome');
const siglaInput = document.getElementById('sigla');
const cancelBtn = document.getElementById('cancelBtn');

function resetForm() {
	cursoIdInput.value = '';
	form.reset();
	siglaInput.disabled = false; // Reabilita o campo de sigla ao resetar o formulário
}

// Renderiza a tabela de cursos com os dados recebidos da API
function renderCursos(cursos) {
	cursosTable.innerHTML = cursos
		.map(
			(curso) => `
				<tr>
					<td>${curso.Nome_curso}</td>
					<td>${curso.Sigla_curso}</td>
					<td>
						<div class="actions">
							<button type="button" data-edit="${curso.Sigla_curso}">Editar</button>
							<button type="button" data-delete="${curso.Sigla_curso}" class="secondary">Excluir</button>
						</div>
					</td>
				</tr>
			`,
		)
		.join('');
}

async function loadCursos() {
	const response = await fetch('/api/cursos/view');
	const cursos = await response.json();
	renderCursos(cursos);
}

async function getCurso(Sigla) {
	const response = await fetch(`/api/cursos/view/${Sigla}`);
	return response.json();
}

// Manipula o envio do formulário para criar ou atualizar um curso
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const payload = {
		Nome_curso: nomeInput.value.trim(),
		Sigla_curso: siglaInput.value.trim(),
	};

	const editingSigla = cursoIdInput.value || null;
	const method = editingSigla ? 'PUT' : 'POST';
	const url = editingSigla
		? `/api/cursos/view/${editingSigla}`
		: '/api/cursos/view';

	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const result = await response.json();

	if (!response.ok) {
		setStatus(result.error || 'Unable to save curso', true);
		return;
	}

	setStatus(editingSigla ? 'Curso atualizado' : 'Curso criado');
	resetForm();
	await loadCursos();
});

cursosTable.addEventListener('click', async (event) => {
	const editId = event.target.dataset.edit;
	const deleteId = event.target.dataset.delete;

	// Preenche o formulário com os dados do curso para edição
	if (editId) {
		const curso = await getCurso(editId);
		nomeInput.value = curso.Nome_curso;
		siglaInput.value = curso.Sigla_curso;
		cursoIdInput.value = curso.Sigla_curso;
		siglaInput.disabled = true; // Desabilita o campo de sigla durante a edição
		setStatus('Editando curso');
	}

	// Deleta o curso e atualiza a tabela
	if (deleteId) {
		const response = await fetch(`/api/cursos/view/${deleteId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setStatus(result.error || 'Unable to delete curso', true);
			return;
		}

		setStatus('Curso excluído');
		resetForm();
		await loadCursos();
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

async function initCursosPage() {
	try {
		await loadCursos();
	} catch {
		setStatus('Não foi possível carregar os cursos. Verifique a API e o banco de dados.', true);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initCursosPage();
});
