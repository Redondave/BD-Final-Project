const cursoModel = require('../model/curso_model');

// Lista as ações do CRUD para o recurso "curso"
const list = async (req, res) => {
  try {
    const cursos = await cursoModel.findAll();
    return res.json(cursos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBySigla = async (req, res) => {
  try {
    const curso = await cursoModel.findBySigla(req.params.sigla);
    if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
    return res.json(curso);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await cursoModel.create(req.body);
    return res.status(201).json({ message: 'Curso criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await cursoModel.update(req.params.sigla, req.body);
    if (!updated) return res.status(404).json({ error: 'Curso não encontrado' });
    return res.json({ message: 'Curso atualizado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await cursoModel.remove(req.params.sigla);
    if (!removed) return res.status(404).json({ error: 'Curso não encontrado' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getBySigla, create, update, remove };
