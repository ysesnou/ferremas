const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// RUTAS DEL WEBPAY
const webpayRoutes = require('./routes/webpay');
app.use('/api', webpayRoutes);


// RUTAS DE LOS PRODUCTOS
const productosRoutes = require('./routes/productos');
app.use('/api', productosRoutes); // LLAMA A LA API


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); 
});

const contactoRoutes = require('./routes/contactos');
app.use('/api', contactoRoutes);

const bancoRoutes = require('./routes/banco');
app.use('/api', bancoRoutes);


