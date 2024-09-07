const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  
  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Login successful!');
  });

  it('should return error with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  
  it('should register successfully with valid data', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'newuser', password: 'newpassword' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully!');
  });

  it('should return error when missing username or password during register', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'newuser' }); 
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Missing username or password');
  });
});
