const servidorModel = require('../model/servidor_model');

// Lista as ações do CRUD para o recurso "servidor"
const list = async (req, res) => {
    try {
        const servidores = await servidorModel.findAll();
        return res.json(servidores);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getByMatricula = async (req, res) => {
    try {
        const servidor = await servidorModel.findByMatricula(req.params.matricula);
        if (!servidor) {
            return res.status(404).json({ error: 'Servidor not found' });
        }
        return res.json(servidor);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const listFuncoes = async (req, res) => {
    try {
        const funcoes = await servidorModel.findAllFuncoes();
        return res.json(funcoes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const matricula = await servidorModel.create(req.body);
        return res.status(201).json({ Matricula: matricula });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        await servidorModel.update(req.params.matricula, req.body);
        return res.json({ updated: true });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await servidorModel.remove(req.params.matricula);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    list,
    getByMatricula,
    listFuncoes,
    create,
    update,
    remove,
};
