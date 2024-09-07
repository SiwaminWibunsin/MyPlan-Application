import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Button 
        onClick={() => navigate('/login')} 
        className="absolute top-4 right-4 bg-blue-500 text-white"
      >
        Login
      </Button>
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">
          Hello welcome to <span className="text-red-500">"MyPlan"</span> application.
        </h1>
        <p className="mb-8 text-gray-600">
          The MyPlan application is a simple yet powerful To-Do List tool designed to help you
          prioritize your daily tasks efficiently. With MyPlan, you'll never forget anything
          important again. No matter how many tasks you have to manage, MyPlan will help
          you plan and track them systematically, ensuring you stay on top of your day and
          achieve your goals.
        </p>
        <Button 
          onClick={() => navigate('/register')} 
          className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold"
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
};

export default Welcome;