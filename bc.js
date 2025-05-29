const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // PERMITIR PETICIONES DEL FRONT END
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} `);
});