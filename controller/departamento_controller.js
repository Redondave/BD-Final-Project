const departamentoModel = require('../model/departamento_model');

// Lista as ações do CRUD para o recurso "departamento"
const list = async (req, res) => {
  try {
    const departamentos = await departamentoModel.findAll();
    return res.json(departamentos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBySigla = async (req, res) => {
  try {
    const departamento = await departamentoModel.findBySigla(req.params.sigla);
    if (!departamento) return res.status(404).json({ error: 'Departamento não encontrado' });
    return res.json(departamento);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await departamentoModel.create(req.body);
    return res.status(201).json({ message: 'Departamento criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await departamentoModel.update(req.params.sigla, req.body);
    if (!updated) return res.status(404).json({ error: 'Departamento não encontrado' });
    return res.json({ message: 'Departamento atualizado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await departamentoModel.remove(req.params.sigla);
    if (!removed) return res.status(404).json({ error: 'Departamento não encontrado' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getBySigla, create, update, remove };
