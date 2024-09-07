import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PlanName = () => {
  const [planName, setPlanName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (planName.trim()) {
      const plans = JSON.parse(localStorage.getItem('plans') || '[]');
      const newPlan = { id: Date.now(), name: planName.trim(), tasks: [] };
      const updatedPlans = Array.isArray(plans) ? [...plans, newPlan] : [newPlan];
      localStorage.setItem('plans', JSON.stringify(updatedPlans));
      navigate(`/plan/${newPlan.id}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">What is your Plan name?</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter your plan name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full bg-green-500 text-white">GO TO YOUR PLAN</Button>
        </form>
      </div>
    </div>
  );
};

export default PlanName;