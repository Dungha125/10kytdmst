import { kv } from '@vercel/kv';
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/', async (req, res) => {
  try {
    const suggestions = await kv.get('suggestions') || [];
    const id = Date.now().toString();
    const newSuggestion = { id, ...req.body, leader_scores: {} };
    suggestions.push(newSuggestion);
    await kv.set('suggestions', suggestions);
    
    res.status(201).json({ message: 'Đã gửi sáng kiến thành công', id: id });
  } catch (error) {
    console.error('Lỗi khi tạo sáng kiến:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi tạo sáng kiến' });
  }
});

router.put('/:id/score', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, note } = req.body;
    const { username } = req.user;
    const suggestions = await kv.get('suggestions') || [];
    const suggestionIndex = suggestions.findIndex(s => s.id === id);
    if (suggestionIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy sáng kiến' });
    }

    if (!suggestions[suggestionIndex].leader_scores) {
      suggestions[suggestionIndex].leader_scores = {};
    }
    
    suggestions[suggestionIndex].leader_scores[username] = { score, note };

    await kv.set('suggestions', suggestions);
    
    res.status(200).json({ message: 'Đã cập nhật điểm thành công' });
  } catch (error) {
    console.error('Lỗi khi chấm điểm:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật điểm' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const suggestions = await kv.get('suggestions') || [];
    const target = suggestions.find(s => s.id === req.params.id);

    if (!target) {
      return res.status(404).json({ message: 'Không tìm thấy sáng kiến' });
    }

    const totalScore = Object.values(target.leader_scores || {}).reduce((sum, s) => sum + (Number(s.score) || 0), 0);
    const ranked = suggestions.map(s => {
      const score = Object.values(s.leader_scores || {}).reduce((sum, l) => sum + (Number(l.score) || 0), 0);
      return { id: s.id, score };
    }).sort((a, b) => b.score - a.score);

    const rank = ranked.findIndex(s => s.id === target.id) + 1;

    res.status(200).json({
      title: target.title,
      description: target.description,
      totalScore,
      rank
    });
  } catch (error) {
    console.error('Lỗi khi xem sáng kiến:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy dữ liệu sáng kiến' });
  }
});

module.exports = router;