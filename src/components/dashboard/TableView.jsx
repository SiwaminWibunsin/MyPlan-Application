import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { groupTasksByDateCategory } from '@/utils/taskUtils';

const TableView = ({ tasks }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getPlanName = (planId) => {
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const plan = plans.find(p => p.id.toString() === planId.toString());
    return plan ? plan.name : 'Unassigned';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Past Dates': return 'text-red-700';
      case 'Today': return 'text-green-700';
      case 'This week': return 'text-blue-700';
      case 'Next week': return 'text-cyan-700';
      case 'Later': return 'text-yellow-700';
      case 'Without a date': return 'text-gray-700';
      default: return 'text-black';
    }
  };

  const groupedTasks = groupTasksByDateCategory(tasks);

  return (
    <div className="space-y-2">
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <div key={category} className="border rounded-lg overflow-hidden">
          <div 
            className={`px-4 py-2 ${getCategoryColor(category)} cursor-pointer`}
            onClick={() => toggleCategory(category)}
          >
            <div className="flex items-center w-full">
              <ChevronDown className={`mr-2 h-4 w-4 transition-transform ${expandedCategories[category] ? 'transform rotate-180' : ''}`} />
              <span className="text-lg font-semibold">{category}</span>
              <span className="ml-2 text-sm font-normal">
                {categoryTasks.length} {categoryTasks.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          {expandedCategories[category] && (
            <div className="px-4 py-2 space-y-2">
              {categoryTasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center">
                  <span className="font-medium">{task.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getPlanName(task.planId)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableView;