const estudanteModel = require('../model/estudante_model');

// Lista as ações do CRUD para o recurso "estudante"
const list = async (req, res) => {
  try {
    const estudantes = await estudanteModel.findAll();
    return res.json(estudantes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByMatricula = async (req, res) => {
  try {
    const estudante = await estudanteModel.findByMatricula(req.params.matricula);
    if (!estudante) return res.status(404).json({ error: 'Estudante não encontrado' });
    return res.json(estudante);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await estudanteModel.create(req.body);
    return res.status(201).json({ message: 'Estudante criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await estudanteModel.update(req.params.matricula, req.body);
    if (!updated) return res.status(404).json({ error: 'Estudante não encontrado' });
    return res.json({ message: 'Estudante atualizado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await estudanteModel.remove(req.params.matricula);
    if (!removed) return res.status(404).json({ error: 'Estudante não encontrado' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getByMatricula, create, update, remove };
