const solicitacaoModel = require('../model/solicitacao_model');

const list = async (req, res) => {
  try {
    const solicitacoes = await solicitacaoModel.findAll();
    return res.json(solicitacoes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBySenha = async (req, res) => {
  try {
    const solicitacao = await solicitacaoModel.findBySenha(req.params.senha);
    if (!solicitacao) return res.status(404).json({ error: 'Solicitação não encontrada' });
    return res.json(solicitacao);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByEstudante = async (req, res) => {
  try {
    const solicitacoes = await solicitacaoModel.findByEstudante(req.params.matricula);
    return res.json(solicitacoes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await solicitacaoModel.create(req.body);
    return res.status(201).json({ message: 'Solicitação criada com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await solicitacaoModel.update(req.params.senha, req.body);
    if (!updated) return res.status(404).json({ error: 'Solicitação não encontrada' });
    return res.json({ message: 'Solicitação atualizada com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await solicitacaoModel.remove(req.params.senha);
    if (!removed) return res.status(404).json({ error: 'Solicitação não encontrada' });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { list, getBySenha, getByEstudante, create, update, remove };
