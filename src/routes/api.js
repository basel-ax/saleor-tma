const express = require('express');
const bodyParser = require('body-parser');
const WebAppHandlers = require('../handlers/webapp');
const saleorService = require('../services/saleor');

const router = express.Router();

// Get products from Saleor
router.get('/products', async (req, res) => {
  try {
    const products = await saleorService.getProducts();
    res.json({ ok: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Web app data handler
router.post('/webapp', bodyParser.json(), async (req, res) => {
  try {
    const { method, ...data } = req.body;
    
    const webAppData = {
      user: { id: req.body.user_id },
      data: data
    };

    let result;
    switch (method) {
      case 'makeOrder':
        result = await WebAppHandlers.handleMakeOrder(webAppData);
        break;
      case 'checkInitData':
        result = await WebAppHandlers.handleCheckInitData(webAppData);
        break;
      case 'sendMessage':
        result = await WebAppHandlers.handleSendMessage(webAppData);
        break;
      default:
        result = { ok: false, error: 'Unknown method' };
    }

    res.json(result);
  } catch (error) {
    console.error('Error handling web app request:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
