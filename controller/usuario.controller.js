// Lista as ações do CRUD para o recurso "usuario"
async function list(req, res) {
  try {
    const usuarios = await usuarioService.list();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getById(req, res) {
  try {
    const usuario = await usuarioService.getById(req.params.id);
    res.json(usuario);
  } catch (error) {
    const status = error.message === 'Usuario not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
}

async function create(req, res) {
  try {
    const usuario = await usuarioService.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const usuario = await usuarioService.update(req.params.id, req.body);
    res.json(usuario);
  } catch (error) {
    const status = error.message === 'Usuario not found' ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    await usuarioService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    const status = error.message === 'Usuario not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};