const express = require('express');
const router = express.Router();
const { getExchangeRate } = require('./bcch');

router.get('/tipo-cambio', async (req, res) => {
  try {
    const { from, to, amount = 1 } = req.query;
    const rate = await getExchangeRate(from, to);
    const convertedAmount = amount * rate;
    
    res.json({
      from,
      to,
      rate,
      amount,
      convertedAmount,
      message: "¡Éxito, mi amor! 💘"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;