
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

const CONFIG_FILE = path.join(__dirname, '../data/config.json');
const SUGGESTIONS_FILE = path.join(__dirname, '../data/suggestions.json');


function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
router.get('/config', (req, res) => {
  if (!fs.existsSync(CONFIG_FILE)) return res.json({});
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
  res.json(config);
});

router.put('/config', authenticateToken, (req, res) => {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2));
  res.send('Đã lưu cấu hình');
});


router.get('/suggestions', authenticateToken, (req, res) => {
  console.log("11111111");
  const data = readJSON(SUGGESTIONS_FILE);
  res.json(data);
});
module.exports = router;
