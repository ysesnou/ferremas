const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/contactos
router.post('/contactos', async (req, res) => {
  const { cliente_nombre, cliente_email, mensaje, vendedor_id } = req.body;

  if (!cliente_nombre || !cliente_email || !mensaje || !vendedor_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
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

// GET /api/contactos/:vendedor_id
router.get('/contactos/:vendedor_id', async (req, res) => {
  const { vendedor_id } = req.params;

  try {
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
