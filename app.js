
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api', require('./routes/auth'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/admin', require('./routes/config'));
app.use('/api/view', require('./routes/suggestions'));

// app.listen(3000, () => console.log('Server đang chạy tại http://localhost:3000'));
module.exports = app;