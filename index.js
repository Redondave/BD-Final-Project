require('dotenv').config();
const db = require('./config/database');

const app = require('./app');

const port = process.env.PORT || 3000;

async function startDb() {
  await db.initializeDatabase();
}

startDb();

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Access in: http://localhost:${port}/`)
});