const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
  port: process.env.db_port
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const sql = 'INSERT INTO User (username, pasword) VALUES (?, ?)';
  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    res.send('User registered');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM User WHERE username = ? AND pasword = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send('Login successful');
    } else {
      res.send('Invalid credentials');
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
