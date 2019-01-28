const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(500).send('Aw nuts there was an error');
});

module.exports = router;
