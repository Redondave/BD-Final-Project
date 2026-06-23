const db = require('../config/database');
const pool = db.appPool;

// Define o modelo de servidor com as operações CRUD
const Servidor = {
    findAll: async function () {
        const [rows] = await pool.query(`
            SELECT u.Matricula, u.Nome, u.Email, u.Data_nascimento,
                   s.Data_contrato, s.idFuncao, f.Nome_fn AS Funcao
            FROM Servidor s
            JOIN Usuario u ON s.Matricula = u.Matricula
            JOIN Funcao  f ON s.idFuncao  = f.Codigo_fn
            ORDER BY u.Matricula DESC
        `);
        return rows;
    },

    findByMatricula: async function (Matricula) {
        const [rows] = await pool.query(`
            SELECT u.Matricula, u.Nome, u.Email, u.Data_nascimento,
                   s.Data_contrato, s.idFuncao, f.Nome_fn AS Funcao
            FROM Servidor s
            JOIN Usuario u ON s.Matricula = u.Matricula
            JOIN Funcao  f ON s.idFuncao  = f.Codigo_fn
            WHERE u.Matricula = ?
        `, [Matricula]);
        return rows[0] || null;
    },

    findAllFuncoes: async function () {
        const [rows] = await pool.query('SELECT Codigo_fn, Nome_fn FROM Funcao ORDER BY Codigo_fn');
        return rows;
    },

    create: async function (servidor) {
        const { Nome, Email, Senha, Data_nascimento, Data_contrato, idFuncao } = servidor;

        const randomNum = Math.floor(Math.random() * 1000000);
        const suffix = randomNum.toString().padStart(6, '0');
        const matriculaCompleta = parseInt('6' + suffix, 10);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Inserção na tabela pai Usuario
            await connection.query(
                'INSERT INTO Usuario (Matricula, Nome, Email, Senha, Data_nascimento) VALUES (?, ?, ?, ?, ?)',
                [matriculaCompleta, Nome, Email, Senha, Data_nascimento]
            );

            // Inserção na tabela filha Servidor (referencia o Usuario recém-criado)
            await connection.query(
                'INSERT INTO Servidor (Matricula, Data_contrato, idFuncao) VALUES (?, ?, ?)',
                [matriculaCompleta, Data_contrato, idFuncao]
            );

            await connection.commit();
            return matriculaCompleta;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    update: async function (Matricula, servidor) {
        const { Nome, Email, Senha, Data_nascimento, Data_contrato, idFuncao } = servidor;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE Usuario SET Nome = ?, Email = ?, Senha = ?, Data_nascimento = ? WHERE Matricula = ?',
                [Nome, Email, Senha, Data_nascimento, Matricula]
            );

            await connection.query(
                'UPDATE Servidor SET Data_contrato = ?, idFuncao = ? WHERE Matricula = ?',
                [Data_contrato, idFuncao, Matricula]
            );

            await connection.commit();
            return true;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },

    remove: async function (Matricula) {
        // CASCADE em Usuario propaga a exclusão para Servidor automaticamente
        const [result] = await pool.query('DELETE FROM Usuario WHERE Matricula = ?', [Matricula]);
        return result.affectedRows > 0;
    },
};

module.exports = Servidor;
