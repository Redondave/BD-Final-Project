const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'projeto',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});


// Função para inicializar o banco de dados
const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        await pool.execute('./config/populate.sql');
        await pool.execute('./config/seed.sql');
        connection.release();
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

initializeDatabase();

module.exports = { pool};
