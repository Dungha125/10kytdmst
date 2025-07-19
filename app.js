const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Middlewares chung
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));


app.use('/api/admin', require('./routes/config'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api/view', require('./routes/suggestions'));
app.use('/api/auth', require('./routes/auth'));


module.exports = app;
