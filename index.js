require('dotenv').config();

const app = require('./public/app');

const port = process.env.PORT || 3000;


// Inicia o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});