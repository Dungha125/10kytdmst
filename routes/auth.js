
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = {
  admin: { password: 'admin123', role: 'admin' },
  leader1: { password: 'leader1', role: 'leader' },
  leader2: { password: 'leader2', role: 'leader' }
};

router.post('/login', (req, res) => {

  const { username, password } = req.body;
  console.log(username);
  const user = users[username];
  console.log(user);

  if (!user || user.password !== password) return res.status(401).send('Sai tài khoản hoặc mật khẩu');
  
  const token = jwt.sign({ username, role: user.role }, 'secret');
  console.log(token);

  console.log("-----------");
  
  res.json({ token, role: user.role, username });
});

module.exports = router;
