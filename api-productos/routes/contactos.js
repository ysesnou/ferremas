const express = require('express');
const router = express.Router();
const db = require('../db');

// LLAMA A LA API/CONTACTOS
router.post('/contactos', async (req, res) => {
  const { cliente_nombre, cliente_email, mensaje, vendedor_id } = req.body;   //LOS CAMPOS QUE TIENE QUE TENER EL CONTACTO EN LA TABLA

  if (!cliente_nombre || !cliente_email || !mensaje || !vendedor_id) {   
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {  // SE HACE CONSULTA EN SQL CON LOS DATOS PARA MANDAR EL MENSAJE
    const sql = `
      INSERT INTO contactos (cliente_nombre, cliente_email, mensaje, vendedor_id)       
      VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [cliente_nombre, cliente_email, mensaje, vendedor_id]);
    res.status(201).json({ mensaje: 'Mensaje enviado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el mensaje: ' + err.message });
  }
});

// LLAMA A LA API /CONTACTOS PARA CONSULTAR EL MENSAJE, ID 1 = MENSAJE CON ID 1, ETC
router.get('/contactos/:vendedor_id', async (req, res) => {
  const { vendedor_id } = req.params;

  try {     // SE HACE CONSULTA DE LOS MENSAJES CON LA ID DE ARRIBA
    const [rows] = await db.query(
      'SELECT * FROM contactos WHERE vendedor_id = ? ORDER BY fecha DESC',
      [vendedor_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar mensajes: ' + err.message });
  }
});

module.exports = router;
