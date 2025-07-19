
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

const SUGGESTIONS_FILE = path.join(__dirname, '../data/suggestions.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

router.post('/', (req, res) => {
  const suggestions = readJSON(SUGGESTIONS_FILE);
  const id = Date.now().toString();
  const newSuggestion = { id, ...req.body, leader_scores: {} };
  suggestions.push(newSuggestion);
  writeJSON(SUGGESTIONS_FILE, suggestions);
  res.send({ message:'Đã gửi sáng kiến',id:id});
});

router.put('/:id/score', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { score, note } = req.body;
  const { username } = req.user;
  const suggestions = readJSON(SUGGESTIONS_FILE);
  const suggestion = suggestions.find(s => s.id === id);
  if (!suggestion) return res.status(404).send('Không tìm thấy');
  if (!suggestion.leader_scores) suggestion.leader_scores = {};
  suggestion.leader_scores[username] = { score, note };
  writeJSON(SUGGESTIONS_FILE, suggestions);
  res.send('Đã cập nhật');
});

router.get('/admin/suggestions', authenticateToken, (req, res) => {
  console.log("1111001111");
  const data = readJSON(SUGGESTIONS_FILE);
  res.json(data);
});

// ✅ API xem lại sáng kiến theo ID (dùng cho view.html)
router.get('/:id', (req, res) => {
  console.log("2222222");
  const suggestions = JSON.parse(fs.readFileSync(SUGGESTIONS_FILE));
  const target = suggestions.find(s => s.id === req.params.id);
  if (!target) return res.status(404).json({ message: 'Không tìm thấy sáng kiến' });

  const totalScore = Object.values(target.leader_scores || {}).reduce((sum, s) => sum + (+s.score || 0), 0);
  const ranked = suggestions.map(s => {
    const score = Object.values(s.leader_scores || {}).reduce((sum, l) => sum + (+l.score || 0), 0);
    return { id: s.id, score };
  }).sort((a, b) => b.score - a.score);

  const rank = ranked.findIndex(s => s.id === target.id) + 1;

  res.json({
    title: target.title,
    description: target.description,
    totalScore,
    rank
  });
});
module.exports = router;
