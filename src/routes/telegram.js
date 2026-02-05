const express = require('express');
const WebhookHandler = require('../handlers/webhook');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const update = req.body;
    await WebhookHandler.handleUpdate(update);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send('Error processing request');
  }
});

module.exports = router;
