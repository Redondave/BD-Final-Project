const funcaoModel = require('../model/funcao_model');

// Lista as ações do CRUD para o recurso "funcao"
const list = async (req, res) => {
  try {
    const funcoes = await funcaoModel.findAll();
    return res.json(funcoes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByCodigo = async (req, res) => {
  try {
    const funcao = await funcaoModel.findByCodigo(req.params.codigo);
    if (!funcao) return res.status(404).json({ error: 'Função não encontrada' });
    return res.json(funcao);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await funcaoModel.create(req.body);
    return res.status(201).json({ message: 'Função criada com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await funcaoModel.update(req.params.codigo, req.body);
    if (!updated) return res.status(404).json({ error: 'Função não encontrada' });
    return res.json({ message: 'Função atualizada com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await funcaoModel.remove(req.params.codigo);
    if (!removed) return res.status(404).json({ error: 'Função não encontrada' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getByCodigo, create, update, remove };
