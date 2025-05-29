const express = require('express');
const router = express.Router();
const axios = require('axios');

// LLAMA A LA API /BANCO, :MONEDA EJ USD CLP EUR 
router.get('/banco/:moneda', async (req, res) => {
  const { moneda } = req.params;  // LLAMA A LA MONEDA DE LA URL

  try {
    const response = await axios.get(`https://mindicador.cl/api/${moneda}`);  //LLAMA A LA API MINDICADOR.CL
    const indicador = response.data.serie[0];  //ACCEDE AL ULTIMO VALOR DE LA MONEDA
    res.json({
      moneda: response.data.nombre,
      fecha: indicador.fecha,
      valor: indicador.valor
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tasa de cambio' });
  }
});

// LLAMA A LA API /BANCO/CONVERTIR
router.post('/banco/convertir', async (req, res) => {
  const { monto, moneda } = req.body;

  if (!monto || !moneda) {
    return res.status(400).json({ error: 'Debes enviar monto y moneda (ej: dolar, euro)' });
  }

  try {
    const response = await axios.get(`https://mindicador.cl/api/${moneda}`);
    const tasa = response.data.serie[0].valor;
    const convertido = monto * tasa;

    res.json({
      monto_origen: monto,
      moneda_origen: moneda,
      tasa_cambio: tasa,
      moneda_destino: 'CLP',
      resultado: convertido
    });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo convertir el monto' });
  }
});

module.exports = router;
