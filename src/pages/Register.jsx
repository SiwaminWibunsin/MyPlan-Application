import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Register component mounted');
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registration attempt started');
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      console.log('Validations passed, proceeding with registration');
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      if (existingUsers.some(user => user.username === username)) {
        setError('Username already exists. Please choose a different username.');
        return;
      }

      const newUser = { username, password };
      existingUsers.push(newUser);

      localStorage.setItem('users', JSON.stringify(existingUsers));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');

      // Clear any existing plans and tasks for the new user
      localStorage.removeItem('plans');
      localStorage.removeItem('tasks');

      console.log('Registration successful, attempting navigation');
      toast.success('Registration successful!');
      
      setTimeout(() => {
        console.log('Navigating to /plan-name');
        navigate('/plan-name');
      }, 0);
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Enter your user name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" className="w-full bg-green-500 text-white">Register</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;