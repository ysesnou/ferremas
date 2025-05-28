const express = require('express');
const router = express.Router();

const { WebpayPlus } = require('transbank-sdk');
const webpay = new WebpayPlus.Transaction();

router.post('/webpay/init', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;

  try {
    const response = await webpay.initTransaction(
      amount,
      buyOrder,
      sessionId,
      returnUrl,
      returnUrl
    );
    res.json({ token: response.token, url: response.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/webpay/commit', async (req, res) => {
  const { token_ws } = req.body;

  try {
    const result = await webpay.commit(token_ws);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/webpay/status/:token', async (req, res) => {
  const token = req.params.token;

  try {
    const status = await webpay.status(token);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
