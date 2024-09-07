import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Welcome from '../../src/pages/Welcome';
import Login from '../../src/pages/Login';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Welcome Component', () => {
  test('renders welcome message', () => {
    render(
      <Router>
        <Welcome />
      </Router>
    );
    const welcomeElement = screen.getByRole('heading', { name: /Hello welcome to "MyPlan" application/i });
    expect(welcomeElement).toBeInTheDocument();
  });

  test('renders login button', () => {
    render(
      <Router>
        <Welcome />
      </Router>
    );
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('renders get started button', () => {
    render(
      <Router>
        <Welcome />
      </Router>
    );
    const getStartedButton = screen.getByText(/GET STARTED/i);
    expect(getStartedButton).toBeInTheDocument();
  });
});

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays error message on invalid login', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });
});