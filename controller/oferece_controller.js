const ofereceModel = require('../model/oferece_model');

const list = async (req, res) => {
  try {
    const ofereceList = await ofereceModel.findAll();
    return res.json(ofereceList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByDepartamento = async (req, res) => {
  try {
    const list = await ofereceModel.findByDepartamento(req.params.sigla);
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByServico = async (req, res) => {
  try {
    const list = await ofereceModel.findByServico(req.params.codigo);
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await ofereceModel.create(req.body);
    return res.status(201).json({ message: 'Relação criada com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { sigla, codigo } = req.params;
    const removed = await ofereceModel.remove(sigla, codigo);
    if (!removed) return res.status(404).json({ error: 'Relação não encontrada' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getByDepartamento, getByServico, create, remove };
