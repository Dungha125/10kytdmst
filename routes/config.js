const { kv } = require('@vercel/kv'); 
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/config', async (req, res) => {
  try {
    const config = await kv.get('system_config') || {};
    res.status(200).json(config);
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy cấu hình' });
  }
});

router.put('/config', authenticateToken, async (req, res) => {
  try {
    await kv.set('system_config', req.body);
    res.status(200).json({ message: 'Đã lưu cấu hình thành công' });
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lưu cấu hình' });
  }
});

router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const data = await kv.get('suggestions') || [];
    res.status(200).json(data);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sáng kiến cho admin:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách sáng kiến' });
  }
});

module.exports = router;