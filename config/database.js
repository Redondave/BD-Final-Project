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

// Criação de um pool de conexões para a aplicação (operações normais de leitura e escrita)
const appPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    database: schemaName
});

module.exports = { adminPool, appPool, initializeDatabase };
