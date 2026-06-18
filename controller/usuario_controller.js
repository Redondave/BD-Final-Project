const path = require('path');
const usuarioModel = require('../model/usuario_model');

// Lista as ações do CRUD para o recurso "usuario"
const list = async (req, res) => {
  try {
    const usuarios = await usuarioModel.findAll();
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getByMatricula = async (req, res) => {
  try {
    const usuario = await usuarioModel.findByMatricula(req.params.matricula);
    return res.json(usuario);
  } catch (error) {
    const status = error.message === 'Usuario not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
}

const create = async (req, res) => {
  try {
    const usuario = await usuarioModel.create(req.body);
    return res.status(201).json(usuario);
  } catch (error) {
    console.error("=== ERRO CAPTURADO ===");
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

const update = async (req, res) => {
  try {
    const usuario = await usuarioModel.update(req.params.matricula, req.body);
    return res.json(usuario);
  } catch (error) {
    const status = error.message === 'Usuario not found' ? 404 : 400;
    return res.status(status).json({ error: error.message });
  }
}

const remove = async (req, res) => {
  try {
    await usuarioModel.remove(req.params.matricula);
    return res.status(204).send();
  } catch (error) {
    const status = error.message === 'Usuario not found' ? 404 : 500;
    return res.status(status).json({ error: error.message });
  }
}

module.exports = {
  list,
  getByMatricula,
  create,
  update,
  remove,
};