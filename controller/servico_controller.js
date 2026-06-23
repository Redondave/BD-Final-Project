const servicoModel = require('../model/servico_model');

// Lista as ações do CRUD para o recurso "servico"
const list = async (req, res) => {
  try {
    const servicos = await servicoModel.findAll();
    return res.json(servicos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByCodigo = async (req, res) => {
  try {
    const servico = await servicoModel.findByCodigo(req.params.codigo);
    if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });
    return res.json(servico);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await servicoModel.create(req.body);
    return res.status(201).json({ message: 'Serviço criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await servicoModel.update(req.params.codigo, req.body);
    if (!updated) return res.status(404).json({ error: 'Serviço não encontrado' });
    return res.json({ message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await servicoModel.remove(req.params.codigo);
    if (!removed) return res.status(404).json({ error: 'Serviço não encontrado' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getByCodigo, create, update, remove };
