const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const schemaName = process.env.DB_NAME || 'projeto';

const adminPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
});

async function databaseExists() {
    const [rows] = await adminPool.query(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [schemaName],
    );

    return rows.length > 0;
}

async function runSqlFile(connection, fileName) {
    const filePath = path.join(__dirname, fileName);
    const sql = fs.readFileSync(filePath, 'utf8');
    const statements = sql
        .split(';')
        .map((statement) => statement.trim())
        .filter(Boolean);

    for (const statement of statements) {
        await connection.query(statement);
    }
}


// Função para inicializar o banco de dados
const initializeDatabase = async () => {
    try {
        if (await databaseExists()) {
            console.log(`Database "${schemaName}" already exists. Dropping and recreating.`);
            await adminPool.query(`DROP DATABASE IF EXISTS \`${schemaName}\``);
        }
        
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
