import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  if (location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center w-full">
      <h1 className="text-xl font-bold">MyPlan application</h1>
      {isLoggedIn && (
        <div className="flex items-center">
          <span className="mr-4">{user.username}</span>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};

export default HeaderBar;