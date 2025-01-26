const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require("dotenv");

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');

  // Select the database
  db.query(`USE ${process.env.DB_NAME}`, (err) => {
    if (err) throw err;
    console.log(`Database ${process.env.DB_NAME} selected.`);
  });
});

const secretKey = 'your_secret_key';

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const sql = 'INSERT INTO user (username, pasword) VALUES (?, ?)';
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) throw err;
    res.send('User registered');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM user WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const user = result[0];
      const passwordIsValid = bcrypt.compareSync(password, user.pasword);
      if (passwordIsValid) {
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 });
        res.json({ auth: true, token: token, username: user.username });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else {
      res.status(404).send('User not found');
    }
  });
});

app.get('/home', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied');
  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ message: 'Welcome to the home page', username: decoded.username });
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

app.get('/logout', (req, res) => {
  res.json({ auth: false, token: null });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
