const avaliacaoModel = require('../model/avaliacao_model');

const list = async (req, res) => {
  try {
    const avaliacoes = await avaliacaoModel.findAll();
    return res.json(avaliacoes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByIds = async (req, res) => {
  try {
    const { idAgentamento, idServidor } = req.params;
    const avaliacoes = await avaliacaoModel.findByIds(idAgentamento, idServidor);
    return res.json(avaliacoes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await avaliacaoModel.create(req.body);
    return res.status(201).json({ message: 'Avaliação criada com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { idAgentamento, idServidor, data_hora } = req.params;
    const removed = await avaliacaoModel.remove(idAgentamento, idServidor, data_hora);
    if (!removed) return res.status(404).json({ error: 'Avaliação não encontrada' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getByIds, create, remove };
