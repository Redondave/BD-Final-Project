const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const schemaName = process.env.DB_NAME || 'projeto';

// Criação de um pool de conexões para operações administrativas (criação e configuração do banco)
const adminPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    multipleStatements: true
});

// Função para verificar se o banco de dados já existe
async function databaseExists() {
    const [rows] = await adminPool.query(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [schemaName],
    );

    return rows.length > 0;
}

// Função para executar um arquivo SQL
async function runSqlFile(connection, fileName) {
    const filePath = path.join(__dirname, fileName);
    const sql = fs.readFileSync(filePath, 'utf8');
    await connection.query(sql);
}


// Função para inicializar o banco de dados
const initializeDatabase = async () => {
    try {
        if (await databaseExists()) {
            console.log(`Database "${schemaName}" already exists. Dropping and recreating.`);

            // Caso o banco de dados já exista, ele é dropado para garantir um ambiente limpo (para testes)
            await adminPool.query(`DROP DATABASE IF EXISTS \`${schemaName}\``);
        }
        
        // Criação do banco de dados e execução dos scripts de criação e seed
        const connection = await adminPool.getConnection();
        try {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${schemaName}\``);
            await connection.query(`USE \`${schemaName}\``);
            await runSqlFile(connection, 'populate.sql');
            await runSqlFile(connection, 'seed.sql');
            console.log('Database initialized successfully');
        } finally {
            connection.release();
        }
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

// Função para traduzir erros de banco de dados para mensagens amigáveis em português
function wrapDbError(err) {
    if (!err) return err;
    
    // 1451: ER_ROW_IS_REFERENCED_2 (Cannot delete or update a parent row: a foreign key constraint fails)
    if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
        const msg = err.message || '';
        if (msg.includes('Servidor') && msg.includes('idFuncao')) {
            err.message = 'Não é possível excluir esta função pois existem servidores associados a ela.';
        } else if (msg.includes('Estudante') && msg.includes('idCurso')) {
            err.message = 'Não é possível excluir este curso pois existem estudantes associados a ele.';
        } else if (msg.includes('Solicitacao') && msg.includes('idEstudante')) {
            err.message = 'Não é possível excluir este estudante pois existem solicitações associadas a ele.';
        } else if (msg.includes('Solicitacao') && msg.includes('Codigo_serv')) {
            err.message = 'Não é possível excluir este serviço pois existem solicitações associadas a ele.';
        } else if (msg.includes('Avaliacao') && msg.includes('idServidor')) {
            err.message = 'Não é possível excluir este servidor pois existem avaliações associadas a ele.';
        } else if (msg.includes('Agendamento') && msg.includes('idSolicitacao')) {
            err.message = 'Não é possível excluir esta solicitação pois existem agendamentos associados a ela.';
        } else if (msg.includes('Avaliacao') && msg.includes('idAgentamento')) {
            err.message = 'Não é possível excluir este agendamento pois existem avaliações associadas a ele.';
        } else if (msg.includes('Oferece') && msg.includes('Sigla_dep')) {
            err.message = 'Não é possível excluir este departamento pois ele oferece serviços cadastrados.';
        } else if (msg.includes('Oferece') && msg.includes('Codigo_serv')) {
            err.message = 'Não é possível excluir este serviço pois ele possui ofertas de departamentos associadas.';
        } else {
            err.message = 'Não é possível excluir ou alterar este registro pois ele está associado a outras informações no sistema.';
        }
    }
    // 1452: ER_NO_REFERENCED_ROW_2 (Cannot add or update a child row: a foreign key constraint fails)
    else if (err.errno === 1452 || err.code === 'ER_NO_REFERENCED_ROW_2') {
        const msg = err.message || '';
        if (msg.includes('Servidor') && msg.includes('idFuncao')) {
            err.message = 'Não é possível cadastrar/atualizar o servidor: a função informada não existe.';
        } else if (msg.includes('Estudante') && msg.includes('idCurso')) {
            err.message = 'Não é possível cadastrar/atualizar o estudante: o curso informado não existe.';
        } else if (msg.includes('Solicitacao') && msg.includes('idEstudante')) {
            err.message = 'Não é possível cadastrar a solicitação: o estudante informado não existe.';
        } else if (msg.includes('Solicitacao') && msg.includes('Codigo_serv')) {
            err.message = 'Não é possível cadastrar a solicitação: o serviço informado não existe.';
        } else if (msg.includes('Avaliacao') && msg.includes('idServidor')) {
            err.message = 'Não é possível cadastrar a avaliação: o servidor informado não existe.';
        } else if (msg.includes('Avaliacao') && msg.includes('idAgentamento')) {
            err.message = 'Não é possível cadastrar a avaliação: o agendamento informado não existe.';
        } else if (msg.includes('Agendamento') && msg.includes('idSolicitacao')) {
            err.message = 'Não é possível cadastrar o agendamento: a solicitação informada não existe.';
        } else if (msg.includes('Oferece') && msg.includes('Sigla_dep')) {
            err.message = 'Não é possível cadastrar a oferta: o departamento informado não existe.';
        } else if (msg.includes('Oferece') && msg.includes('Codigo_serv')) {
            err.message = 'Não é possível cadastrar a oferta: o serviço informado não existe.';
        } else {
            err.message = 'Erro de integridade: um ou mais identificadores informados (chave estrangeira) não existem no sistema.';
        }
    }
    // 1062: ER_DUP_ENTRY (Duplicate entry for key)
    else if (err.errno === 1062 || err.code === 'ER_DUP_ENTRY') {
        const msg = err.message || '';
        if (msg.includes('Email') || msg.includes('Usuario.Email')) {
            err.message = 'O e-mail informado já está cadastrado para outro usuário.';
        } else if (msg.includes('PRIMARY') || msg.includes('Matricula') || msg.includes('Usuario.PRIMARY')) {
            err.message = 'A matrícula informada já está cadastrada no sistema.';
        } else if (msg.includes('Nome_serv') || msg.includes('Servico.Nome_serv')) {
            err.message = 'Um serviço com este nome já está cadastrado.';
        } else if (msg.includes('Nome_dep') || msg.includes('Departamento.Nome_dep')) {
            err.message = 'Um departamento com este nome já está cadastrado.';
        } else {
            err.message = 'Já existe um registro cadastrado com estes identificadores (duplicidade).';
        }
    }
    
    return err;
}

function wrapConnection(conn) {
    return new Proxy(conn, {
        get(target, prop, receiver) {
            const val = Reflect.get(target, prop, receiver);
            if (typeof val === 'function') {
                if (prop === 'query' || prop === 'execute') {
                    return async function(...args) {
                        try {
                            return await val.apply(target, args);
                        } catch (err) {
                            throw wrapDbError(err);
                        }
                    };
                }
                return val.bind(target);
            }
            return val;
        }
    });
}

// Criação de um pool de conexões para a aplicação (operações normais de leitura e escrita)
const rawAppPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    database: schemaName
});

// Proxy para interceptar as chamadas do pool
const appPool = new Proxy(rawAppPool, {
    get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === 'function') {
            if (prop === 'query' || prop === 'execute') {
                return async function(...args) {
                    try {
                        return await val.apply(target, args);
                    } catch (err) {
                        throw wrapDbError(err);
                    }
                };
            }
            if (prop === 'getConnection') {
                return async function(...args) {
                    try {
                        const conn = await val.apply(target, args);
                        return wrapConnection(conn);
                    } catch (err) {
                        throw wrapDbError(err);
                    }
                };
            }
            return val.bind(target);
        }
        return val;
    }
});

module.exports = { adminPool, appPool, initializeDatabase };
