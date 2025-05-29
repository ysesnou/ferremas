const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/productos', async (req, res) => {
  const {
    id,
    codigo,         
    interno,        
    nombre,
    marca,
    categoria,
    stock           
  } = req.query;

  let sql = `
    SELECT
      p.id,
      p.codigo_producto,
      p.codigo_interno,
      p.nombre,
      p.marca,
      p.stock,
      c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c
      ON p.categoria_id = c.id
    WHERE 1 = 1
  `;
  const params = [];

  // FILTRAR POR ID, MARCA, NOMBRE ETC
  if (id) {
    sql += ' AND p.id = ?';
    params.push(Number(id));
  }


  if (codigo) {
    sql += ' AND p.codigo_producto = ?';
    params.push(codigo);
  }

  if (interno) {
    sql += ' AND p.codigo_interno = ?';
    params.push(interno);
  }


  if (nombre) {
    sql += ' AND p.nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  if (marca) {
    sql += ' AND p.marca LIKE ?';
    params.push(`%${marca}%`);
  }


  if (categoria) {
    sql += ' AND c.nombre LIKE ?';
    params.push(`%${categoria}%`);
  }


  if (stock) {
    sql += ' AND p.stock = ?';
    params.push(Number(stock));
  }

  try {
    const [rows] = await db.query(sql, params);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos con esos filtros' });
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error en la consulta: ' + err.message });
  }
});

// RUTA PARA BUSCAR UN PRODUCTO SOLO POR CODIGO
router.get('/productos/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.codigo_producto,
        p.codigo_interno,
        p.nombre,
        p.marca,
        p.stock,
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c
        ON p.categoria_id = c.id
      WHERE p.codigo_producto = ?
      `,
      [codigo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto: ' + err.message });
  }
});

module.exports = router;
