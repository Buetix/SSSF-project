'use strict';

require('dotenv').config();
const express = require('express');
const db = require('./models/db');
const app = express();
const cors = require('cors');

app.use(cors);

app.get('/', (req, res) => {
   res.send('Hello world') 
});

db.on('connected', () => {
   app.listen(3000, () => console.log(`Example app listening on port 3000!`));
});