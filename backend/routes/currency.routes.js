
const express = require('express');
const router = express.Router();
const currencies = require('../config/currencies.config');

router.get('/', (req, res) => {
  res.json({ currencies });
});

module.exports = router;