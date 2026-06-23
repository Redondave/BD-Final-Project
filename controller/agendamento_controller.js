const agendamentoModel = require('../model/agendamento_model');

const list = async (req, res) => {
  try {
    const agendamentos = await agendamentoModel.findAll();
    return res.json(agendamentos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const agendamento = await agendamentoModel.findById(req.params.id);
    if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
    return res.json(agendamento);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await agendamentoModel.create(req.body);
    return res.status(201).json({ message: 'Agendamento criado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await agendamentoModel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Agendamento não encontrado' });
    return res.json({ message: 'Agendamento atualizado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await agendamentoModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Agendamento não encontrado' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getById, create, update, remove };
