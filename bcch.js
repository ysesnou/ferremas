const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Endpoint 1: Obtener valor del dólar
app.get('/api/dolar', async (req, res) => {
    try {
        const response = await axios.get(
            "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx",
            {
                params: {
                    user: "darklinkshiny@gmail.com",
                    pass: "Joaco0608",
                    firstdate: new Date().toISOString().split('T')[0],
                    lastdate: new Date().toISOString().split('T')[0],
                    timeseries: "F073.TCO.PRE.Z.D",
                    function: "GetSeries"
                }
            }
        );
        const valorDolar = response.data.Series.Obs[0].value;
        res.json({ valorDolar: parseFloat(valorDolar) });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar el BCCh" });
    }
});

// Endpoint 2: Convertir CLP a USD
app.get('/api/clp-to-usd', async (req, res) => {
    const { cantidad } = req.query;

    if (!cantidad || isNaN(cantidad)) {
        return res.status(400).json({ error: "Ingresa una cantidad válida en CLP" });
    }

    try {
        const response = await axios.get("http://localhost:3000/api/dolar");
        const valorDolar = response.data.valorDolar;
        const resultado = parseFloat(cantidad) / valorDolar;

        res.json({
            cantidad_clp: parseFloat(cantidad),
            valor_dolar: valorDolar,
            cantidad_usd: resultado.toFixed(2),
            fecha: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Error en la conversión" });
    }
});

app.listen(3000, () => console.log('Servidor listo en http://localhost:3000'));

