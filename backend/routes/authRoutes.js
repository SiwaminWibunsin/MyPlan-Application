const express = require('express');
const router = express.Router();


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  
  if (username === 'admin' && password === 'password') {
    return res.status(200).json({ message: 'Login successful!' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});


router.post('/register', (req, res) => {
  const { username, password } = req.body;

  
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  
  return res.status(201).json({ message: 'User registered successfully!' });
});

module.exports = router;
